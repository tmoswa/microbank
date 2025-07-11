// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function DashboardPage() {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState('');
    const [blacklisted, setBlacklisted] = useState(false);
    const navigate = useNavigate();

    const stored = localStorage.getItem('token');
    const token = stored ? JSON.parse(stored).token : null;

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
        const res = await fetch(`${import.meta.env.VITE_CLIENT_API}/api/clients/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.status === 403 || data.blacklisted) {
            setBlacklisted(true);
            setMessage('You are blacklisted and cannot transact.');
            return;
        }

        if (!res.ok) {
            setBlacklisted(true);
            setMessage('An error has occurred, our Engineers are working flat out to resolve the issue.');
            return;
        }

        setBlacklisted(false);
        fetchAccount();
        fetchTransactions();
    } catch (err) {
        setBlacklisted(true);
        setMessage('Failed to fetch profile. Please try again later.');
    }
};


const fetchAccount = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BANKING_API}/api/accounts/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setAccount(data);
        } catch (err) {
            setMessage('Failed to fetch account.');
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BANKING_API}/api/accounts/me/transactions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            setMessage('Failed to fetch transactions.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Navbar role="client" />
            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-2">Account Info</h2>
                {blacklisted ? (
                    <div className="text-red-600 font-semibold">{message}</div>
                ) : account ? (
                    <>
                        <p><strong>Balance:</strong> ${account.balance}</p>
                        <Link to="/transaction" className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                            Deposit / Withdraw
                        </Link>
                    </>
                ) : (
                    <p>Loading account...</p>
                )}
            </div>

            {!blacklisted && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                    {transactions.length > 0 ? (
                        <ul className="space-y-2">
                            {transactions.map((tx) => (
                                <li key={tx.id} className="border-b py-2">
                                    <span className="font-semibold">{tx.type.toUpperCase()}</span>: ${tx.amount} on {new Date(tx.timestamp).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No transactions yet.</p>
                    )}
                </div>
            )}

            {message && <div className="mt-4 text-center text-sm text-gray-700">{message}</div>}
        </div>
    );
}

export default DashboardPage;
