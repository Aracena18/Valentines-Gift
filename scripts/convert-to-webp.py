"""
Convert JPEG/PNG images to WebP format.

Usage:
    python scripts/convert-to-webp.py                     # converts all images in public/images/
    python scripts/convert-to-webp.py path/to/folder      # converts all images in specified folder
    python scripts/convert-to-webp.py photo.jpg            # converts a single file

Options (edit below):
    QUALITY  - WebP quality 1-100 (default: 80)
    RESIZE   - Max width in px, None to keep original size
"""

from pathlib import Path
import sys

# ── Settings ──────────────────────────────────────────
QUALITY = 80        # WebP quality (1-100)
RESIZE = 1200       # Max width in px (set to None to skip resizing)
DELETE_ORIGINAL = True  # Set True to remove the original after converting
# ──────────────────────────────────────────────────────

try:
    from PIL import Image
except ImportError:
    print("Pillow is not installed. Installing now...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image


SUPPORTED = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}


def convert_image(src: Path, quality: int, max_width: int | None) -> Path | None:
    if src.suffix.lower() not in SUPPORTED:
        return None

    dest = src.with_suffix(".webp")

    img = Image.open(src)

    # Convert palette/RGBA modes properly
    if img.mode in ("RGBA", "LA"):
        pass  # keep alpha
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Resize if needed
    if max_width and img.width > max_width:
        ratio = max_width / img.width
        new_size = (max_width, int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    img.save(dest, "WEBP", quality=quality)

    src_kb = src.stat().st_size / 1024
    dest_kb = dest.stat().st_size / 1024
    saved = ((src_kb - dest_kb) / src_kb) * 100 if src_kb > 0 else 0

    print(f"  ✓ {src.name} → {dest.name}  ({src_kb:.0f}KB → {dest_kb:.0f}KB, {saved:.0f}% smaller)")

    if DELETE_ORIGINAL:
        src.unlink()
        print(f"    🗑 Deleted original: {src.name}")

    return dest


def main():
    # Determine target path
    if len(sys.argv) > 1:
        target = Path(sys.argv[1])
    else:
        # Default: public/images/ relative to project root
        target = Path(__file__).resolve().parent.parent / "public" / "images"

    if not target.exists():
        print(f"❌ Path not found: {target}")
        sys.exit(1)

    print(f"🖼  Converting images to WebP (quality={QUALITY}, max_width={RESIZE})")
    print(f"📂 Target: {target}\n")

    converted = 0

    if target.is_file():
        result = convert_image(target, QUALITY, RESIZE)
        if result:
            converted = 1
    else:
        for ext in SUPPORTED:
            for img_path in sorted(target.glob(f"*{ext}")):
                if convert_image(img_path, QUALITY, RESIZE):
                    converted += 1
            # Also check uppercase extensions
            for img_path in sorted(target.glob(f"*{ext.upper()}")):
                if convert_image(img_path, QUALITY, RESIZE):
                    converted += 1

    if converted == 0:
        print("⚠  No supported images found. (Supported: JPEG, PNG, BMP, TIFF)")
    else:
        print(f"\n✅ Done! Converted {converted} image(s) to WebP.")
        if not DELETE_ORIGINAL:
            print("💡 Originals kept. Set DELETE_ORIGINAL = True in the script to auto-remove them.")


if __name__ == "__main__":
    main()
