import { supabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** Formats a numeric enquiry id as a customer-facing reference (AS-RFQ-0042). */
export function formatEnquiryRef(id) {
  return id ? `AS-RFQ-${String(id).padStart(4, '0')}` : `AS-RFQ-${Date.now().toString().slice(-4)}`;
}

/**
 * Persists a website enquiry. Tries the Supabase submit function, then a plain
 * insert, then the FastAPI
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

  // 1. Database function: inserts and returns the new id. Visitors cannot read
  //    the enquiries table, so a plain insert could not return the reference.
  try {
    const { data, error } = await supabase.rpc('submit_enquiry', {
      p_name: payload.name,
      p_phone: payload.phone,
      p_email: payload.email,
      p_product: payload.product,
      p_message: payload.message,
      p_source: payload.source,
    });
    if (!error && data) {
      alertSalesTeam(data);
      return { ref: formatEnquiryRef(data), saved: true };
    }
  } catch {
    /* fall through */
  }

  // 2. Plain insert (allowed insert-only), without reading the row back.
  try {
    const { error } = await supabase.from('enquiries').insert([payload]);
    if (!error) return { ref: formatEnquiryRef(null), saved: true };
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

/**
 * Asks the backend to email the sales team about a new enquiry. Fire-and-forget:
 * the visitor never waits for it, and `keepalive` lets it finish if they leave.
 * The backend sends at most one email per enquiry.
 */
function alertSalesTeam(id) {
  try {
    fetch(`${API_BASE}/api/v1/enquiries/${id}/notify`, { method: 'POST', keepalive: true }).catch(() => {});
  } catch {
    /* alerts are best-effort */
  }
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
