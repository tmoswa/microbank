import React, { useState } from 'react';
import axios from 'axios';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8081/api/clients/login', { email, password });
            console.log('JWT:', res.data.token);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="p-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
        </form>
    );
};
export default Login;