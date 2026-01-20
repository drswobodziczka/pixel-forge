/**
 * Base class for all API providers.
 * Enforces a common interface for generating assets.
 */
class APIProvider {
    constructor(name) {
        this.name = name;
    }

    /**
     * Returns the schema for provider-specific parameters.
     * Used to generate the UI dynamically.
     * @returns {Array<Object>} - Array of parameter objects { id, label, type, default, options, ... }
     */
    getSchema() {
        return [];
    }

    /**
     * Generates an image based on the prompt and options.
     * @param {string} prompt - The text prompt.
     * @param {Object} options - Configuration options (width, height, seed, model, etc.).
     * @returns {Promise<string>} - A promise that resolves to the image URL.
     */
    async generate(prompt, options) {
        throw new Error('generate() must be implemented by the provider');
    }
}

/**
 * Provider for Pollinations.ai
 * Free, URL-based, no API key required.
 */
class PollinationsProvider extends APIProvider {
    constructor() {
        super('Pollinations.ai');
        this.baseUrl = 'https://image.pollinations.ai/prompt';
    }

    getSchema() {
        return [
            {
                id: 'model',
                label: 'Model',
                type: 'select',
                default: 'flux',
                options: [
                    { value: 'flux', label: 'Flux (Best Quality)' },
                    { value: 'turbo', label: 'Turbo (Fast)' },
                    { value: 'unity', label: 'Unity' } // Added Unity based on common Pollinations usage
                ]
            }
        ];
    }

    async generate(prompt, options) {
        const { width, height, seed, model } = options;
        const encodedPrompt = encodeURIComponent(prompt);
        
        // Construct URL with parameters
        // Added 'nologo=true' to remove watermarks if possible
        // Added 'model' parameter support
        let url = `${this.baseUrl}/${encodedPrompt}?width=${width}&height=${height}&nologo=true`;
        
        if (seed) {
            url += `&seed=${seed}`;
        }
        
        if (model) {
            url += `&model=${model}`;
        }

        // Pollinations returns the image directly, so the URL itself is the source.
        // We preload it to ensure it exists/generates before returning.
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject(new Error('Failed to generate image with Pollinations.ai'));
            img.src = url;
        });
    }
}

/**
 * Provider for Hugging Face Inference API
 * Requires API Key.
 */
class HuggingFaceProvider extends APIProvider {
    constructor() {
        super('Hugging Face');
        this.defaultModel = 'stabilityai/stable-diffusion-3.5-large';
    }

    getSchema() {
        return [
            {
                id: 'model',
                label: 'Model',
                type: 'select',
                default: this.defaultModel,
                options: [
                    { value: 'stabilityai/stable-diffusion-3.5-large', label: 'Stable Diffusion 3.5 Large' },
                    { value: 'black-forest-labs/FLUX.1-dev', label: 'Flux.1 Dev' },
                    { value: 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', label: 'Flux Midjourney Mix' }
                ]
            },
            {
                id: 'negative_prompt',
                label: 'Negative Prompt',
                type: 'text',
                default: '',
                placeholder: 'bad quality, blurry, text...'
            },
            {
                id: 'b_guidance_scale', // calling it b_ to potentially act as a hint, but standard is guidance_scale usually
                label: 'Guidance Scale',
                type: 'range',
                min: 1,
                max: 20,
                step: 0.5,
                default: 7.5
            }
        ];
    }

    async generate(prompt, options) {
        const { width, height, seed, model, apiKey, negative_prompt, b_guidance_scale } = options;
        
        if (!apiKey) {
            throw new Error('API Key is required for Hugging Face');
        }

        const modelToUse = model || this.defaultModel;
        const url = `https://api-inference.huggingface.co/models/${modelToUse}`;

        const params = {
            width: width,
            height: height,
            seed: seed,
            num_inference_steps: 25,
            guidance_scale: parseFloat(b_guidance_scale || 7.5)
        };
        
        if (negative_prompt) {
            params.negative_prompt = negative_prompt;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'x-use-cache': 'false'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: params
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face API Error: ${response.status} ${errorText}`);
        }

        const blob = await response.blob();
        return window.URL.createObjectURL(blob);
    }
}

/**
 * Provider for PixelLab.ai (Pixel Art)
 * Requires API Key.
 */
class PixelLabProvider extends APIProvider {
    constructor() {
        super('PixelLab');
        this.baseUrl = 'https://api.pixellab.ai/v1/generate-image-pixflux'; // Pixflux is default
    }

    getSchema() {
        return [
            {
                id: 'model_type',
                label: 'PixelLab Model',
                type: 'select',
                default: 'pixflux',
                options: [
                    { value: 'pixflux', label: 'PixFlux (Standard)' },
                    { value: 'bitforge', label: 'BitForge (Advanced Styles)' }
                ]
            },
            {
                id: 'negative_prompt',
                label: 'Negative Prompt',
                type: 'text',
                default: '',
                placeholder: 'bad quality, blurry...'
            }
        ];
    }

    async generate(prompt, options) {
        const { width, height, seed, apiKey, model_type, negative_prompt } = options;
        
        if (!apiKey) {
            throw new Error('API Key is required for PixelLab');
        }

        // Switch endpoint based on model selection
        const endpoint = model_type === 'bitforge' 
            ? 'https://api.pixellab.ai/v1/generate-image-bitforge'
            : 'https://api.pixellab.ai/v1/generate-image-pixflux';

        const body = {
            prompt: prompt,
            width: width,
            height: height,
            seed: seed
        };

        if (negative_prompt) {
            body.negative_prompt = negative_prompt;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            if (response.status === 404) throw new Error('PixelLab API Endpoint not found. Please check implementation.');
            const errorText = await response.text();
            throw new Error(`PixelLab API Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data.url || data.image || data.output; 
    }
}

/**
 * Provider for Recraft.ai
 * Requires API Key.
 */
class RecraftProvider extends APIProvider {
    constructor() {
        super('Recraft');
        this.baseUrl = 'https://external.api.recraft.ai/v1/images/generations';
    }

    getSchema() {
        return [
            {
                id: 'style',
                label: 'Style',
                type: 'select',
                default: 'digital_illustration',
                options: [
                    { value: 'digital_illustration', label: 'Digital Illustration' },
                    { value: 'realistic_image', label: 'Realistic Image' },
                    { value: 'vector_illustration', label: 'Vector Illustration' }
                ]
            },
            {
                id: 'substyle',
                label: 'Substyle (Optional)',
                type: 'select',
                default: '',
                options: [
                    { value: '', label: 'None' },
                    { value: 'pixel_art', label: 'Pixel Art' },
                    { value: 'hand_drawn', label: 'Hand Drawn' },
                    { value: 'grain', label: 'Grain' },
                    { value: 'infantile_sketch', label: 'Infantile Sketch' },
                    { value: '2d_art_poster', label: '2D Art Poster' },
                    { value: 'handmade_3d', label: 'Handmade 3D' },
                    { value: 'hand_drawn_outline', label: 'Hand Drawn Outline' },
                    { value: 'engraving_color', label: 'Engraving Color' },
                    { value: '2d_art_poster_2', label: '2D Art Poster 2' }
                ]
            }
        ];
    }

    async generate(prompt, options) {
        const { width, height, apiKey, style, substyle } = options;
        
        if (!apiKey) {
            throw new Error('API Key is required for Recraft');
        }

        let fullStyle = style || 'digital_illustration';
        if (substyle && style === 'digital_illustration') {
             // Substyles are often combined or just sent as the specific style if the API supports it flatly,
             // or as "style/substyle". Based on research, it seems values like 'digital_illustration/pixel_art' work.
             fullStyle = `${style}/${substyle}`;
        }
        
        // Recraft defaults to vector if 'vector_illustration' is chosen, 
        // let's handle that simple logic if user picks 'vector_illustration' + 'pixel_art' which is invalid?
        // For now, trust the combination logic above.

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                size: `${width}x${height}`,
                style: fullStyle
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Recraft API Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        if (data.data && data.data.length > 0 && data.data[0].url) {
            return data.data[0].url;
        }
        return data.url;
    }
}

// Export for use in main script
window.APIProviders = {
    Pollinations: PollinationsProvider,
    HuggingFace: HuggingFaceProvider,
    PixelLab: PixelLabProvider,
    Recraft: RecraftProvider
};
