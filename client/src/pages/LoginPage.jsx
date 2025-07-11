import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!username || !password) {
            toast.error("Username and password are required.");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_CLIENT_API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const contentType = res.headers.get("content-type");
            const data = contentType?.includes("application/json") ? await res.json() : {};

            if (res.ok) {
                const token = data.token;
                dispatch(login({ token }));
                toast.success("Login successful!");

                // Optional: decode token client-side (fallback)
                const role = data.role || (token && jwtDecode(token)?.role) || "client";
                navigate(role === "admin" ? "/admin" : "/dashboard");
            } else {
                toast.error(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h1 className="text-2xl font-bold mb-6">Login</h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Login
                </button>

                <p className="text-sm mt-4 text-center">
                    Don&apos;t have an account?
                    <a href="/register" className="text-blue-600 underline ml-1">Register here</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
