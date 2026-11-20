"""New-enquiry email alerts for the sales team.

Configured through SMTP_* settings. When they are missing, nothing is sent and
the enquiry is still saved; the admin desk shows it as usual.
"""
import html
import logging
import re
import smtplib
import ssl
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)


def smtp_configured() -> bool:
    return bool(settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD)


def _recipients() -> list:
    raw = settings.NOTIFY_EMAILS or settings.SALES_EMAIL or ""
    return [e.strip() for e in raw.split(",") if e.strip()]


def _wa_link(phone: str, name: str, product: str) -> str:
    digits = re.sub(r"\D", "", phone or "")
    if len(digits) == 10:
        digits = "91" + digits
    text = f"Hello {name}, this is Aggarwal Steels regarding your enquiry for {product}."
    return f"https://wa.me/{digits}?text=" + re.sub(r"\s", "%20", text)


def build_message(enquiry) -> EmailMessage:
    name = enquiry.name or "Website visitor"
    product = enquiry.product or "General enquiry"
    rows = [
        ("Name", name),
        ("Phone", enquiry.phone or ""),
        ("Email", enquiry.email or "Not given"),
        ("Product", product),
        ("Details", enquiry.message or "None"),
        ("Came from", (enquiry.source or "website").replace("_", " ")),
        ("Reference", f"AS-RFQ-{enquiry.id:04d}"),
    ]
    admin_url = settings.SITE_URL.rstrip("/") + "/admin/enquiries"
    wa_url = _wa_link(enquiry.phone, name, product)

    msg = EmailMessage()
    msg["Subject"] = f"New enquiry: {product} from {name}"
    msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
    msg["To"] = ", ".join(_recipients())
    if enquiry.email:
        msg["Reply-To"] = enquiry.email

    text = "\n".join(f"{k}: {v}" for k, v in rows)
    msg.set_content(f"New enquiry from the website.\n\n{text}\n\nReply on WhatsApp: {wa_url}\nOpen in admin: {admin_url}\n")

    cells = "".join(
        f'<tr><td style="padding:6px 12px;color:#64748b;white-space:nowrap">{html.escape(k)}</td>'
        f'<td style="padding:6px 12px;color:#0f172a">{html.escape(str(v))}</td></tr>'
        for k, v in rows
    )
    msg.add_alternative(f"""
<div style="font-family:Arial,sans-serif;max-width:560px">
  <h2 style="margin:0 0 4px;color:#0f172a">New enquiry from the website</h2>
  <p style="margin:0 0 16px;color:#64748b">Reply quickly: buyers usually ask more than one supplier.</p>
  <table style="border-collapse:collapse;border:1px solid #e2e8f0;width:100%">{cells}</table>
  <p style="margin:18px 0 0">
    <a href="tel:{html.escape(enquiry.phone or '')}" style="background:#0f172a;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;margin-right:8px">Call</a>
    <a href="{html.escape(wa_url)}" style="background:#16a34a;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;margin-right:8px">Reply on WhatsApp</a>
    <a href="{html.escape(admin_url)}" style="background:#d97706;color:#1a1206;padding:10px 16px;border-radius:6px;text-decoration:none">Open in admin</a>
  </p>
</div>""", subtype="html")
    return msg


def send_enquiry_alert(enquiry) -> bool:
    """Sends the alert. Returns True when an email was handed to the mail server."""
    if not smtp_configured():
        logger.info("Enquiry %s saved; email alerts are not configured (SMTP_*).", enquiry.id)
        return False
    recipients = _recipients()
    if not recipients:
        return False
    try:
        msg = build_message(enquiry)
        if int(settings.SMTP_PORT) == 465:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, 465, context=ssl.create_default_context(), timeout=20) as s:
                s.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                s.send_message(msg)
        else:
            with smtplib.SMTP(settings.SMTP_HOST, int(settings.SMTP_PORT), timeout=20) as s:
                s.starttls(context=ssl.create_default_context())
                s.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                s.send_message(msg)
        logger.info("Enquiry alert for %s sent to %s", enquiry.id, recipients)
        return True
    except Exception as e:  # never break the enquiry because mail failed
        logger.error("Enquiry alert for %s failed: %s", enquiry.id, e)
        return False
