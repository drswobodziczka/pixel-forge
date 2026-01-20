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
- **Multi-Provider Support**: Choose between Pollinations (Free), Hugging Face, PixelLab, and Recraft.
- **[Setup Guide & API Keys](PROVIDERS.md)**: Instructions on getting keys for all providers.
    - **URL Pattern:** `https://image.pollinations.ai/prompt/{prompt}?width={w}&height={h}&seed={s}&model={m}`
- **Pros:** Completely free, unlimited, fast.
- **Cons:** Consistency can vary, "artsy" style by default without careful prompting.

### 2. Hugging Face Inference API
- **Type:** Free Tier (Credit-based), Requires API Token.
- **Best For:** High-quality production assets, specific styles (SDXL, Flux).
- **Key Features:**
    - Access to SOTA models like `stabilityai/stable-diffusion-xl-base-1.0` or `black-forest-labs/FLUX.1-dev`.
    - Can use community fine-tunes (LoRAs) for pixel art.
- **Pros:** Best quality/price ratio for free tier.
- **Cons:** Rate limits, requires account setup.

### 3. PixelLab API
- **Type:** Freemium (Trial/Daily Limits).
- **Best For:** Pure Pixel Art sprites and animations.
- **Key Features:**
    - Specialized model trained *only* on pixel art.
    - Tools for removing backgrounds automatically.
- **Pros:** Best-in-class for retro game assets.
- **Cons:** Limited free usage.

### 4. Recraft.ai
- **Type:** Freemium.
- **Best For:** Vector art, UI icons, consistent style generation.
- **Pros:** Infinite scalability (vectors), clean style.
- **Cons:** API access often restricted to paid plans.

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

