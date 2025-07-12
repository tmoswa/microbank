import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBanking } from '../hooks/useBanking';
import Navbar from '../components/Navbar';

function DepositWithdrawal() {
    const [amount, setAmount] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const { token } = useAuth();
    const { message, performTransaction } = useBanking(token);
    const navigate = useNavigate();

    const handleTransaction = async (type) => {
        if (isDisabled) return;
        setIsDisabled(true);
        setTimeout(() => setIsDisabled(false), 5000);

        const success = await performTransaction(type, amount);
        if (success) setAmount('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Navbar />
            <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">Deposit / Withdraw</h2>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="border p-2 rounded w-full mb-4"
                />
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleTransaction('deposit')}
                            disabled={isDisabled}
                            className={`px-4 py-2 rounded text-white ${isDisabled ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500'}`}
                        >
                            Deposit
                        </button>
                        <button
                            onClick={() => handleTransaction('withdraw')}
                            disabled={isDisabled}
                            className={`px-4 py-2 rounded text-white ${isDisabled ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-500'}`}
                        >
                            Withdraw
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="ml-auto bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                        Back to Dashboard
                    </button>
                </div>
                {message && (
                    <div className={`mt-4 text-center text-sm font-semibold ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DepositWithdrawal;