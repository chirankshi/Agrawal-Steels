import { supabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** Formats a numeric enquiry id as a customer-facing reference (AS-RFQ-0042). */
export function formatEnquiryRef(id) {
  return id ? `AS-RFQ-${String(id).padStart(4, '0')}` : `AS-RFQ-${Date.now().toString().slice(-4)}`;
}

/**
 * Persists a website enquiry. Tries Supabase first, then the optional FastAPI
 * backend. Never throws: if both stores are unreachable it still returns a
 * reference so the visitor gets a confirmation and the sales desk can follow
 * up by phone.
 *
 * @param {{name: string, phone: string, email?: string, product?: string, message?: string, source?: string}} input
 * @returns {Promise<{ref: string, saved: boolean}>}
 */
export async function submitEnquiry(input) {
  const payload = {
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    product: input.product || 'General Steel Inquiry',
    message: input.message || null,
    status: 'pending',
    source: input.source || 'website_rfq_form',
  };

  try {
    const { data, error } = await supabase.from('enquiries').insert([payload]).select().single();
    if (!error && data?.id) return { ref: formatEnquiryRef(data.id), saved: true };
  } catch {
    /* fall through to backend */
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      return { ref: formatEnquiryRef(data.id), saved: true };
    }
  } catch {
    /* offline */
  }

  return { ref: formatEnquiryRef(null), saved: false };
}

/** Joins optional RFQ fields into the single free-text `message` column. */
export function buildEnquiryNotes({ company, quantity, location, message }) {
  return [
    company ? `Company: ${company}` : '',
    quantity ? `Quantity/Tonnage: ${quantity}` : '',
    location ? `Delivery Site: ${location}` : '',
    message ? `Details: ${message}` : '',
  ]
    .filter(Boolean)
    .join(' | ');
}
