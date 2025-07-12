const API_URL = import.meta.env.VITE_BANKING_API;

export const bankingService = {
    fetchAccount: async (token) => {
        const response = await fetch(`${API_URL}/api/accounts/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch account');
        return response.json();
    },

    fetchTransactions: async (token) => {
        const response = await fetch(`${API_URL}/api/accounts/me/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return response.json();
    },

    performTransaction: async (token, type, amount) => {
        const response = await fetch(`${API_URL}/api/accounts/${type}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: parseFloat(amount) }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Transaction failed');
        return data;
    },
};