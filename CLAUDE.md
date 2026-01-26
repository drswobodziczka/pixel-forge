# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PixelForge is a client-side web application for generating 2D game assets (sprites, textures, backgrounds) using various AI image generation APIs. It's built with vanilla JavaScript, HTML, and Tailwind CSS with no build process required.

## Project Management

- **Task Management**: GitHub Projects and GitHub Issues
- **Project Board**: [Pixel Forge Roadmap](https://github.com/users/drswobodziczka/projects/3)
- **Repository**: https://github.com/drswobodziczka/pixel-forge

All tasks, bugs, and feature requests are tracked via GitHub Issues and managed on the Project Board.

## Development Principles & Workflow

1.  **No ticket, no work**: Every task must be associated with a GitHub Issue. Do not start work without an issue reference.
2.  **Pull Request Workflow**: All changes must go through a Pull Request. No direct pushes to the main branch.
3.  **Concept Brainstorming**: Every new concept must first be brainstormed with the agent. The result must be finalized as a GitHub Issue with the appropriate label from the project list.
4.  **Conventional Commits**: All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat:`, `fix:`, `docs:`, `chore:`).
5.  **Agent UI Testing**: Every UI change MUST be explicitly tested by the agent using the browser tools to ensure it works as expected.

## Development Commands

### Running the Application

The app is purely client-side and requires only a static file server:

```bash
# Using Python (pre-installed on macOS)
python3 -m http.server

# Using npx
npx serve .
```

Then navigate to `http://localhost:8000` (Python) or the port shown by `serve`.

### No Build Process

This project has no build, lint, or test commands. It uses vanilla JavaScript with ES6 classes loaded directly in the browser.

## Architecture

### Provider Pattern

The application uses a **modular provider architecture** to support multiple AI image generation APIs:

- **Base Class**: `APIProvider` (js/providers.js:5) defines the interface all providers must implement
- **Key Methods**:
  - `getSchema()` - Returns provider-specific UI parameters (model selection, negative prompts, etc.)
  - `generate(prompt, options)` - Generates an image and returns a URL or blob URL

### Current Providers

1. **PollinationsProvider** (js/providers.js:34) - Free, no API key required, URL-based generation
2. **HuggingFaceProvider** (js/providers.js:88) - Requires API key, supports multiple Stable Diffusion/Flux models
3. **PixelLabProvider** (js/providers.js:175) - Requires API key, specialized for pixel art (PixFlux/BitForge models)
4. **RecraftProvider** (js/providers.js:250) - Requires API key, supports various illustration styles

All providers are registered in `window.APIProviders` (js/providers.js:335).

### Main Application Flow

1. **Initialization** (script.js:1):
   - Load saved API keys from localStorage
   - Set up provider change handlers
   - Render dynamic UI based on selected provider's schema

2. **Dynamic UI Rendering** (script.js:51):
   - `renderProviderSettings()` generates HTML inputs based on provider `getSchema()`
   - Supports input types: `select`, `text`, `range`

3. **Image Generation** (script.js:139):
   - Collect prompt, dimensions, seed, and provider-specific options
   - Instantiate selected provider class
   - Call `provider.generate()` with collected options
   - Display result or handle errors

4. **Download** (script.js:224):
   - Fetch generated image as blob
   - Create download link with timestamp filename

### API Key Management

- API keys are stored in `localStorage` with key `pixelForge_apiKey` (script.js:20)
- Keys are provider-agnostic (same key field for all providers)
- Pollinations doesn't require a key; UI hides the API key field when Pollinations is selected (script.js:36)

## Adding New Providers

To add a new AI image generation provider:

1. Create a new class extending `APIProvider` in `js/providers.js`
2. Implement `getSchema()` to define UI controls
3. Implement `generate(prompt, options)` to return image URL/blob URL
4. Add the provider to `window.APIProviders` object
5. Add `<option>` in `index.html` provider selector (index.html:42)

Example provider-specific parameters in schema:
- Model selection (select dropdown)
- Negative prompts (text input)
- Guidance scale (range slider)
- Style/substyle options (select dropdown)

## Code Conventions

- **Vanilla JavaScript**: No frameworks, no transpilation
- **ES6 Classes**: Provider pattern uses class inheritance
- **Async/Await**: All API calls use promises
- **Tailwind CSS**: Utility-first styling via CDN
- **Error Handling**: User-facing alerts for failures, console errors for debugging

## File Structure

```
pixel-forge/
├── index.html           # Main UI with Tailwind CSS
├── script.js            # Application logic and UI handlers
├── style.css            # Custom CSS (animations, neon effects)
├── js/
│   └── providers.js     # Provider classes (APIProvider base + implementations)
├── docs/                # Learning and documentation materials
├── README.md            # API usage guide and tips
├── PROVIDERS.md         # Instructions for obtaining API keys
└── *.md                 # Project planning and backlog files
```

## Important Notes

- **CORS**: Some providers may require CORS proxies or return blob URLs instead of direct URLs
- **Seed Handling**: If no seed provided, generate random seed (script.js:158)
- **Image Preloading**: Pollinations provider preloads images to verify generation success (js/providers.js:75)
- **Error Recovery**: Download fallback opens image in new tab if fetch fails due to CORS (script.js:241)
