# PixelForge - Game Asset Generator Knowledge Base

## Overview
PixelForge is a modular web application designed to generate 2D game assets (sprites, textures, backgrounds) using various AI APIs.

## Supported APIs

### 1. Pollinations.ai (Default)
- **Type:** Free, Open Source, No Key Required.
- **Best For:** Rapid prototyping, concept art, textures.
- **Key Features:**
    - **Models:** `flux` (default, high quality), `turbo` (fast), `pixel` (specialized).
    - **Instant Generation**: Text-to-Image using state-of-the-art AI models.
- **URL Pattern:** `https://image.pollinations.ai/prompt/{prompt}?width={w}&height={h}&seed={s}&model={m}`
- **Pros:** Completely free, unlimited, fast.
- **Cons:** Consistency can vary, "artsy" style by default without careful prompting.

## Web Platform Alternatives (No Code)
If you prefer using a browser-based tool directly:
- **Leonardo.ai:** Excellent for game assets, daily free tokens.
- **Scenario.com:** Specialized for game dev, allows training custom models.
- **OpenArt.ai:** Great for discovery and remixing prompts.

## Tips for Better Results (Pollinations)
- **Use the `model` parameter:** Try `&model=flux` for better adherence to prompts.
- **Prompt Engineering:**
    - **Bad:** "A plane"
    - **Good:** "pixel art sprite of a ww2 fighter plane, top down view, neutral background, 32 bit color, clean lines, game asset --no shading"
- **Seed:** Always lock the seed (e.g., `seed=42`) when iterating on a prompt to see actual changes.

## Local Development

Since PixelForge is a client-side web application (HTML/CSS/JS), you can run it with any static file server.

### using Python (pre-installed on macOS)
```bash
python3 -m http.server
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

### using npx (Node.js)
```bash
npx serve .
```

