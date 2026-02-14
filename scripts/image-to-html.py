"""
Convert an image to HTML pixel art using colored characters.

Usage:
    python scripts/image-to-html.py path/to/image.webp
    python scripts/image-to-html.py path/to/image.webp --width 100
    python scripts/image-to-html.py path/to/image.webp --mode blocks
    python scripts/image-to-html.py path/to/image.webp --mode ascii

Modes:
    blocks  — Uses ██ colored block characters (default, closest to photo)
    ascii   — Uses ASCII characters (.,:-=+*#%@) based on brightness
    dots    — Uses ● colored dot characters
    text    — Uses a custom repeated text string

Options:
    --width   Number of characters wide (default: 80)
    --output  Output HTML file path (default: output.html)
    --text    Custom text for "text" mode (default: "LOVE")
    --bg      Background color (default: #0f0f1a)
"""

import sys
import os

try:
    from PIL import Image
except ImportError:
    print("Installing Pillow...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

# ASCII brightness ramp (dark to light)
ASCII_CHARS = " .,:-=+*#%@"


def image_to_html(image_path, width=80, mode="blocks", custom_text="LOVE", bg_color="#0f0f1a"):
    img = Image.open(image_path).convert("RGB")

    # Calculate new height maintaining aspect ratio
    # Characters are ~2x taller than wide, so halve the height
    aspect = img.height / img.width
    height = int(width * aspect * 0.5)

    img_resized = img.resize((width, height), Image.LANCZOS)

    # Build HTML
    rows = []
    text_idx = 0

    for y in range(height):
        row_chars = []
        for x in range(width):
            r, g, b = img_resized.getpixel((x, y))
            color = f"#{r:02x}{g:02x}{b:02x}"
            brightness = (r * 299 + g * 587 + b * 114) / 1000  # perceived brightness

            if mode == "blocks":
                char = "██"
            elif mode == "ascii":
                idx = int(brightness / 255 * (len(ASCII_CHARS) - 1))
                char = ASCII_CHARS[idx] * 2
            elif mode == "dots":
                char = "●&thinsp;"
            elif mode == "text":
                char = custom_text[text_idx % len(custom_text)]
                text_idx += 1
            else:
                char = "██"

            row_chars.append(f'<span style="color:{color}">{char}</span>')

        rows.append("".join(row_chars))

    lines_html = "<br>\n".join(rows)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HTML Art — {os.path.basename(image_path)}</title>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    background: {bg_color};
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    overflow-x: auto;
  }}
  .art {{
    font-family: "Courier New", monospace;
    font-size: 6px;
    line-height: 7px;
    letter-spacing: 0px;
    white-space: nowrap;
    user-select: none;
  }}
  /* Responsive font sizing */
  @media (max-width: 768px) {{
    .art {{ font-size: 3px; line-height: 3.5px; }}
  }}
  @media (min-width: 1200px) {{
    .art {{ font-size: 8px; line-height: 9px; }}
  }}
</style>
</head>
<body>
<div class="art">
{lines_html}
</div>
</body>
</html>"""

    return html


def main():
    if len(sys.argv) < 2:
        print("Usage: python image-to-html.py <image_path> [options]")
        print("  --width 80     Character width (default: 80)")
        print("  --mode blocks  Mode: blocks, ascii, dots, text")
        print("  --output out.html  Output file")
        print("  --text LOVE    Custom text for text mode")
        print("  --bg #0f0f1a   Background color")
        sys.exit(1)

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(f"❌ File not found: {image_path}")
        sys.exit(1)

    # Parse args
    width = 80
    mode = "blocks"
    output = None
    custom_text = "LOVE"
    bg_color = "#0f0f1a"

    args = sys.argv[2:]
    i = 0
    while i < len(args):
        if args[i] == "--width" and i + 1 < len(args):
            width = int(args[i + 1]); i += 2
        elif args[i] == "--mode" and i + 1 < len(args):
            mode = args[i + 1]; i += 2
        elif args[i] == "--output" and i + 1 < len(args):
            output = args[i + 1]; i += 2
        elif args[i] == "--text" and i + 1 < len(args):
            custom_text = args[i + 1]; i += 2
        elif args[i] == "--bg" and i + 1 < len(args):
            bg_color = args[i + 1]; i += 2
        else:
            i += 1

    if output is None:
        base = os.path.splitext(os.path.basename(image_path))[0]
        output = f"{base}-art.html"

    print(f"🖼  Converting: {image_path}")
    print(f"   Mode: {mode}, Width: {width} chars")

    html = image_to_html(image_path, width, mode, custom_text, bg_color)

    with open(output, "w", encoding="utf-8") as f:
        f.write(html)

    size_kb = os.path.getsize(output) / 1024
    print(f"✅ Saved to {output} ({size_kb:.0f} KB)")
    print(f"   Open in browser to see the result!")


if __name__ == "__main__":
    main()
