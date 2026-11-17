import re
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status

router = APIRouter(prefix="/uploads", tags=["Image Uploads"])

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
MAX_BYTES = 8 * 1024 * 1024


@router.post("", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_image(file: UploadFile = File(...)):
    """Stores a product image under /uploads and returns its public path."""
    ext = ALLOWED.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=415, detail="Only JPEG, PNG or WebP images are accepted")

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="Image larger than 8 MB")

    stem = re.sub(r"[^a-z0-9-]+", "-", Path(file.filename or "image").stem.lower()).strip("-") or "image"
    name = f"{stem}-{uuid.uuid4().hex[:8]}.{ext}"
    (UPLOAD_DIR / name).write_bytes(data)
    return {"url": f"/uploads/{name}", "filename": name, "size": len(data)}
