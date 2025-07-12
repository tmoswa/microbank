import { useState, useCallback } from 'react';
import { bankingService } from '../api/bankingService';
import { toast } from 'react-hot-toast';

export const useBanking = (token) => {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState('');

    const fetchAccount = useCallback(async () => {
        try {
            const data = await bankingService.fetchAccount(token);
            setAccount(data);
        } catch (error) {
            setMessage(error.message);
        }
    }, [token]);

    const fetchTransactions = useCallback(async () => {
        try {
            const data = await bankingService.fetchTransactions(token);
            setTransactions(data);
        } catch (error) {
            setMessage(error.message);
        }
    }, [token]);

    const performTransaction = useCallback(async (type, amount) => {
        try {
            const data = await bankingService.performTransaction(token, type, amount);
            setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} successful: $${amount}`);
            return true;
        } catch (error) {
            setMessage(error.message);
            return false;
        }
    }, [token]);

    return { account, transactions, message, fetchAccount, fetchTransactions, performTransaction };
};