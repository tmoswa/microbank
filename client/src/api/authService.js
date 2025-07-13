const API_URL = import.meta.env.VITE_CLIENT_API;

export const authService = {
    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Login failed');
        }
        return response.json();
    },

    register: async ({ fullname, email, password, blacklisted = false }) => {
        const response = await fetch(`${API_URL}/clients/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullname, email, username: email, password, blacklisted }),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Registration failed');
        }
        return response.json();
    },
};