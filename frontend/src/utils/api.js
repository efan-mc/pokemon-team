const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    console.log('Making request to:', url);

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.log(`API Error (${endpoint}):`, error);
        throw error;
    }
}