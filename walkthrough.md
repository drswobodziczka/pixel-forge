# Game Asset Generator Walkthrough

I have built a simple, free, and fast web-based tool for generating indie game assets.

## What I Built
- **PixelForge**: A single-page web application.
- **Tech Stack**: HTML5, Vanilla JavaScript, TailwindCSS (via CDN), Custom CSS.
- **API**: Pollinations.ai (Free, No Key required).

## Features
- **Instant Generation**: Type a prompt and get an image.
- **Customizable Size**: Set width and height (e.g., 64x64 for sprites, 1920x1080 for backgrounds).
- **Seed Control**: Use specific seeds for reproducible results.
- **Premium UI**: Cyberpunk/Neon aesthetic with glassmorphism effects.
- **Download**: One-click download of generated assets.

## How to Use
1. Open the folder containing the files.
2. Double-click `index.html` to open it in your default browser.
3. Enter a prompt (e.g., "pixel art spaceship").
4. Click **GENERATE ASSET**.
5. Right-click or use the **Download** button to save your asset.

## Verification
I have implemented the code to handle:
- API requests to Pollinations.ai.
- Loading states to prevent multiple clicks.
- Error handling if the image fails to load.
- Dynamic image sizing based on user input.

> [!TIP]
> For best results with pixel art, try adding "pixel art" or "16-bit" to your prompt and setting a small size like 64x64 or 128x128.
