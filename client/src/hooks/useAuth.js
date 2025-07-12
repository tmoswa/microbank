import { useDispatch, useSelector } from 'react-redux';
import { login, logout, setLoading } from '../store/slices/authSlice';
import { authService } from '../api/authService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, role, loading } = useSelector((state) => state.auth);

    const validateRegisterForm = ({ fullname, email, password, confirmPassword }) => {
        const errors = {};
        if (!fullname) errors.fullname = 'Full name is required.';
        if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email required.';
        if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)) {
            errors.password = 'Password must be at least 6 characters, include a number and a special character.';
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }
        return errors;
    };

    const handleLogin = async (username, password) => {
        if (!username || !password) {
            toast.error('Username and password are required');
            return;
        }
        dispatch(setLoading(true));
        try {
            const data = await authService.login(username, password);
            // Persistent debug logs
            //localStorage.setItem('debug:loginResponse', JSON.stringify(data));
            //console.log('Login API response:', data);
            const token = data.token;
            const decoded = jwtDecode(token);
            //localStorage.setItem('debug:decodedJWT', JSON.stringify(decoded));
            //console.log('Decoded JWT:', decoded);
            const userRole = data.role || decoded.role || 'client';
            //localStorage.setItem('debug:selectedRole', userRole);
            //console.log('Selected role for navigation:', userRole);
            dispatch(login({ token }));
            toast.success('Login successful!');
            setTimeout(() => {
                navigate(userRole === 'admin' ? '/admin' : '/dashboard');
            }, 1000); // 1 sec delay
        } catch (error) {
            localStorage.setItem('debug:loginError', JSON.stringify(error));
            console.error('Login error:', error);
            toast.error(error.message || 'Login failed');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRegister = async ({ fullname, email, password, confirmPassword, blacklisted = false }) => {
        const errors = validateRegisterForm({ fullname, email, password, confirmPassword });
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            toast.error(firstError);
            return { errors };
        }

        dispatch(setLoading(true));
        try {
            await authService.register({ fullname, email, password, blacklisted });
            toast.success('Registration successful!');
            navigate('/');
            return { errors: {} };
        } catch (error) {
            console.error('Register error:', error);
            const serverErrors = error.message.includes('failed') ? { general: error.message } : error.errors || {};
            toast.error(serverErrors.general || Object.values(serverErrors)[0] || 'Registration failed');
            return { errors: serverErrors };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return { token, role, loading, handleLogin, handleRegister, handleLogout };
};