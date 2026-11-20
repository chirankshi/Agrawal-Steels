"""Admin image uploads.

With SUPABASE_URL + SUPABASE_SERVICE_KEY set, images go to Supabase Storage
(bucket SUPABASE_BUCKET) and the public URL is returned. Without them, local
development falls back to the backend/uploads folder; production refuses,
because the host's disk is wiped on every restart.
"""
import re
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.config import settings
from app.routers.auth import require_admin

router = APIRouter(prefix="/uploads", tags=["Image Uploads"])

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
MAX_BYTES = 8 * 1024 * 1024


def _clean(text: str, fallback: str) -> str:
    return re.sub(r"[^a-z0-9-]+", "-", (text or "").lower()).strip("-") or fallback


def _to_supabase(path: str, data: bytes, content_type: str) -> str:
    base = settings.SUPABASE_URL.rstrip("/")
    bucket = settings.SUPABASE_BUCKET
    url = f"{base}/storage/v1/object/{bucket}/{urllib.parse.quote(path)}"
    req = urllib.request.Request(url, data=data, method="POST", headers={
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
        "apikey": settings.SUPABASE_SERVICE_KEY,
        "Content-Type": content_type,
        "x-upsert": "true",
    })
    try:
        with urllib.request.urlopen(req, timeout=30):
            pass
    except urllib.error.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Image storage rejected the upload ({e.code})")
    except urllib.error.URLError:
        raise HTTPException(status_code=502, detail="Image storage is unreachable")
    return f"{base}/storage/v1/object/public/{bucket}/{urllib.parse.quote(path)}"


@router.post("", status_code=status.HTTP_201_CREATED, include_in_schema=False, dependencies=[Depends(require_admin)])
@router.post("/", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
async def upload_image(file: UploadFile = File(...), folder: str = Form("")):
    """Stores an image and returns its public URL. Admin only."""
    ext = ALLOWED.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=415, detail="Only JPEG, PNG or WebP images are accepted")

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="Image larger than 8 MB")

    stem = _clean(Path(file.filename or "image").stem, "image")
    name = f"{stem}-{uuid.uuid4().hex[:8]}.{ext}"
    folder_path = "/".join(_clean(part, "x") for part in folder.split("/") if part.strip()) or "uploads"

    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        url = _to_supabase(f"{folder_path}/{name}", data, file.content_type)
        return {"url": url, "filename": name, "size": len(data), "storage": "supabase"}

    if settings.APP_ENV.lower() == "production":
        raise HTTPException(status_code=503, detail="Image storage is not configured on the server")

    (UPLOAD_DIR / name).write_bytes(data)
    return {"url": f"/uploads/{name}", "filename": name, "size": len(data), "storage": "local"}
