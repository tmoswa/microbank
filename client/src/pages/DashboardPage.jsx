import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useClient } from '../hooks/useClient';
import { useBanking } from '../hooks/useBanking';
import Navbar from '../components/Navbar';

function DashboardPage() {
    const { token, handleLogout } = useAuth();
    const { profile, message: clientMessage, blacklisted, fetchProfile } = useClient(token);
    const { account, transactions, message: bankingMessage, fetchAccount, fetchTransactions } = useBanking(token);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const isNotBlacklisted = await fetchProfile();
            if (isNotBlacklisted) {
                fetchAccount();
                fetchTransactions();
            }
        };
        loadData();
    }, [fetchProfile, fetchAccount, fetchTransactions]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Navbar />
            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-2">Account Info</h2>
                {blacklisted ? (
                    <div className="text-red-600 font-semibold">{clientMessage}</div>
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
                                    <span className="font-semibold">{tx.type.toUpperCase()}</span>: ${tx.amount} on{' '}
                                    {new Date(tx.timestamp).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No transactions yet.</p>
                    )}
                </div>
            )}

            {(clientMessage || bankingMessage) && (
                <div className="mt-4 text-center text-sm text-gray-700">{clientMessage || bankingMessage}</div>
            )}
        </div>
    );
}

export default DashboardPage;