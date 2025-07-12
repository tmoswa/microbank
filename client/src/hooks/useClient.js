import { useState, useCallback } from 'react';
import { clientService } from '../api/clientService';
import { toast } from 'react-hot-toast';

export const useClient = (token) => {
    const [clients, setClients] = useState([]);
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState('');
    const [blacklisted, setBlacklisted] = useState(false);

    const fetchClients = useCallback(async () => {
        try {
            const data = await clientService.fetchClients(token);
            setClients(data);
        } catch (error) {
            setMessage(error.message);
        }
    }, [token]);

    const fetchProfile = useCallback(async () => {
        try {
            const data = await clientService.fetchProfile(token);
            if (data.blacklisted) {
                setBlacklisted(true);
                setMessage('You are blacklisted and cannot transact.');
                return false;
            }
            setProfile(data);
            setBlacklisted(false);
            return true;
        } catch (error) {
            setBlacklisted(true);
            setMessage(error.message);
            return false;
        }
    }, [token]);

    const toggleBlacklist = useCallback(async (clientId, currentStatus) => {
        try {
            await clientService.toggleBlacklist(token, clientId, currentStatus);
            setMessage('Action Successful');
            fetchClients();
        } catch (error) {
            setMessage(error.message);
        }
    }, [token, fetchClients]);

    return { clients, profile, message, blacklisted, fetchClients, fetchProfile, toggleBlacklist };
};