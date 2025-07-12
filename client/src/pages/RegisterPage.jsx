import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const { handleRegister, loading } = useAuth();

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h1 className="text-2xl font-bold mb-6">Register</h1>
                <input
                    type="text"
                    placeholder="Enter your Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                    disabled={loading}
                />
                <input
                    type="text"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mb-1 p-2 border rounded"
                    disabled={loading}
                />
                <button
                    onClick={() => handleRegister({ fullname, email, password, confirmPassword })}
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500'}`}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <p className="text-sm mt-4 text-center">
                    Already have an account?{' '}
                    <a href="/" className="text-blue-600 underline ml-1">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;