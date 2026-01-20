# Game Asset Generator Implementation Plan

## Goal Description
Build a simple, free, and fast web-based tool for generating 2D game assets (sprites, textures, backgrounds) using the Pollinations.ai API. The tool will be a local HTML/JS application that the user can run in their browser.

## User Review Required
> [!NOTE]
> This tool relies on the free Pollinations.ai API. Availability and performance depend on their service.

## Proposed Changes

### Web Application
#### [NEW] [index.html](file:///Users/rafal.wawrzkowicz/.gemini/antigravity/playground/giant-spicule/index.html)
- Main entry point.
- Contains the UI: Prompt input, size controls (width/height), "Generate" button, and image display.
- Uses TailwindCSS (via CDN for simplicity) for styling to ensure it looks "premium" as requested.

#### [NEW] [script.js](file:///Users/rafal.wawrzkowicz/.gemini/antigravity/playground/giant-spicule/script.js)
- Handles the API logic.
- Constructs the URL for Pollinations.ai: `https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}&seed={seed}&nologo=true`
- Updates the DOM with the generated image.
- Adds download functionality.

#### [NEW] [style.css](file:///Users/rafal.wawrzkowicz/.gemini/antigravity/playground/giant-spicule/style.css)
- Custom styles for specific animations or overrides.

## Verification Plan

### Automated Tests
- None for this simple frontend app.

### Manual Verification
1. Open `index.html` in a browser.
2. Enter a prompt like "pixel art sword".
3. Click "Generate".
4. Verify an image appears.
5. Click "Download" and verify the file is saved.
