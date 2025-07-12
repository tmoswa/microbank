const API_URL = import.meta.env.VITE_CLIENT_API;

export const clientService = {
    fetchClients: async (token) => {
        const response = await fetch(`${API_URL}/api/clients`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch clients');
        return response.json();
    },

    fetchProfile: async (token) => {
        const response = await fetch(`${API_URL}/api/clients/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to fetch profile');
        }
        return response.json();
    },

    toggleBlacklist: async (token, clientId, currentStatus) => {
        const response = await fetch(`${API_URL}/api/clients/${clientId}/blacklist`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to update blacklist status');
        return response.json();
    },
};