import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [blacklisted, setBlacklisted] = useState(false);
    const navigate = useNavigate();


    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errs = {};
        if (!fullname) errs.fullname = "Full name is required.";
        if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = "Valid email required.";
        if (!username) errs.username = "Username is required.";
        if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)) {
            errs.password = "Password must be at least 6 characters, include a number and a special character.";
        }
        if (password !== confirmPassword) {
            errs.confirmPassword = "Passwords do not match.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_CLIENT_API}/api/clients/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, email, username, password, blacklisted })
            });

            const contentType = res.headers.get("content-type");
            let data = {};

            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            }

            if (res.ok) {
                toast.success(data.message || "Registration successful!");
                navigate('/');
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                    const firstError = Object.values(data.errors)[0];
                    toast.error(firstError || "Registration failed.");
                } else {
                    toast.error(data.message || "Registration failed.");
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Network error or server unreachable.");
        }
    };



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
                />
                {errors.fullname && <p className="text-sm text-red-500 mb-2">{errors.fullname}</p>}
                <input
                    type="text"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                {errors.email && <p className="text-sm text-red-500 mb-2">{errors.email}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                {errors.username && <p className="text-sm text-red-500 mb-2">{errors.username}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                {errors.password && <p className="text-sm text-red-500 mb-2">{errors.password}</p>}

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full mb-1 p-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded`}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mb-2">{errors.confirmPassword}</p>}


                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;
