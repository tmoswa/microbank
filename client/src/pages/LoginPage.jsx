import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin, loading } = useAuth();

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <input
                    type="text"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <button
                    onClick={() => handleLogin(username, password)}
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500'}`}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p className="text-sm mt-4 text-center">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-600 underline ml-1">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;