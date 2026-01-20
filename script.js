document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const seedInput = document.getElementById('seed');
    const generateBtn = document.getElementById('generateBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultImage = document.getElementById('resultImage');
    const placeholder = document.getElementById('placeholder');
    const actionBar = document.getElementById('actionBar');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // New Elements for Multi-Provider
    const providerSelect = document.getElementById('provider');
    const apiKeyContainer = document.getElementById('apiKeyContainer');
    const apiKeyInput = document.getElementById('apiKey');
    const providerSettingsContainer = document.getElementById('providerSettings');

    // Load saved API Key
    const savedApiKey = localStorage.getItem('pixelForge_apiKey');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }

    // Provider Change Handler
    providerSelect.addEventListener('change', () => {
        const providerName = providerSelect.value;
        updateUIForProvider(providerName);
    });

    // Initial UI Setup
    updateUIForProvider(providerSelect.value);

    function updateUIForProvider(providerName) {
        // Handle API Key Visibility
        if (providerName !== 'Pollinations') {
            apiKeyContainer.classList.remove('hidden');
        } else {
            apiKeyContainer.classList.add('hidden');
        }

        // Render Dynamic Settings
        const ProviderClass = window.APIProviders[providerName];
        if (ProviderClass) {
            const tempProvider = new ProviderClass(); // Instantiate to access getSchema
            const schema = tempProvider.getSchema();
            renderProviderSettings(schema);
        }
    }

    function renderProviderSettings(schema) {
        providerSettingsContainer.innerHTML = ''; // Clear existing

        schema.forEach(field => {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex flex-col gap-2';

            const label = document.createElement('label');
            label.className = 'text-xs font-semibold text-gray-400 uppercase';
            label.textContent = field.label;
            wrapper.appendChild(label);

            let input;

            if (field.type === 'select') {
                input = document.createElement('select');
                input.className = 'w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors';
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    if (opt.value === field.default) option.selected = true;
                    input.appendChild(option);
                });
            } else if (field.type === 'text') {
                input = document.createElement('input');
                input.type = 'text';
                input.className = 'w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors';
                if (field.placeholder) input.placeholder = field.placeholder;
                input.value = field.default || '';
            } else if (field.type === 'range') {
                input = document.createElement('div');
                input.className = 'flex items-center gap-2';
                
                const range = document.createElement('input');
                range.type = 'range';
                range.min = field.min;
                range.max = field.max;
                range.step = field.step;
                range.value = field.default;
                range.className = 'w-full';
                
                const valueDisplay = document.createElement('span');
                valueDisplay.className = 'text-white text-sm w-8';
                valueDisplay.textContent = field.default;

                range.addEventListener('input', () => {
                    valueDisplay.textContent = range.value;
                });

                input.appendChild(range);
                input.appendChild(valueDisplay);
                
                // Store the actual input element on the wrapper for easier retrieval? 
                // Alternatively, give the range input a specific ID logic.
                // For simplicity, we'll attach the ID to the range input.
                range.id = `setting_${field.id}`;
                wrapper.appendChild(input); 
                providerSettingsContainer.appendChild(wrapper);
                return; // Special early return for range structure to avoid double appending
            }

            if (input) {
                input.id = `setting_${field.id}`;
                wrapper.appendChild(input);
            }

            providerSettingsContainer.appendChild(wrapper);
        });
    }

    // Save API Key on change
    apiKeyInput.addEventListener('input', () => {
        localStorage.setItem('pixelForge_apiKey', apiKeyInput.value);
    });

    let currentImageUrl = '';

    generateBtn.addEventListener('click', generateImage);

    // Allow Enter key to trigger generation in the prompt textarea
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateImage();
        }
    });

    async function generateImage() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a prompt!');
            return;
        }

        // UI Loading State
        setLoading(true);
        
        // Hide previous results
        resultImage.classList.add('hidden');
        placeholder.classList.add('hidden');
        actionBar.classList.remove('translate-y-0');
        actionBar.classList.add('translate-y-full');

        // Configuration
        const width = widthInput.value || 512;
        const height = heightInput.value || 512;
        const seed = seedInput.value ? seedInput.value : Math.floor(Math.random() * 1000000);
        const selectedProviderName = providerSelect.value;
        const apiKey = apiKeyInput.value.trim();

        // Instantiate selected provider
        const ProviderClass = window.APIProviders[selectedProviderName];
        if (!ProviderClass) {
            alert('Invalid provider selected');
            setLoading(false);
            return;
        }
        
        const provider = new ProviderClass();
        
        // Collect Dynamic Options
        const dynamicOptions = {};
        const schema = provider.getSchema();
        schema.forEach(field => {
            const input = document.getElementById(`setting_${field.id}`);
            if (input) {
                dynamicOptions[field.id] = input.value;
            }
        });

        try {
            const options = {
                width,
                height,
                seed,
                apiKey: apiKey,
                ...dynamicOptions
            };

            const imageUrl = await provider.generate(prompt, options);

            resultImage.src = imageUrl;
            resultImage.classList.remove('hidden');
            currentImageUrl = imageUrl;
            
            // Show action bar
            actionBar.classList.remove('translate-y-full');
            actionBar.classList.add('translate-y-0');
            
            setLoading(false);
        } catch (error) {
            console.error(error);
            alert('Failed to generate image. Please try again.');
            placeholder.classList.remove('hidden');
            setLoading(false);
        }
    }

    function setLoading(isLoading) {
        if (isLoading) {
            generateBtn.disabled = true;
            generateBtn.querySelector('span').textContent = 'GENERATING...';
            loadingSpinner.classList.remove('hidden');
            generateBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            generateBtn.disabled = false;
            generateBtn.querySelector('span').textContent = 'GENERATE ASSET';
            loadingSpinner.classList.add('hidden');
            generateBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    downloadBtn.addEventListener('click', async () => {
        if (!currentImageUrl) return;

        try {
            const response = await fetch(currentImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pixelforge-asset-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback for simple open in new tab if fetch fails (CORS)
            window.open(currentImageUrl, '_blank');
        }
    });
});
