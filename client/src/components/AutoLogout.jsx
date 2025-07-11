import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { jwtDecode } from 'jwt-decode';

const AutoLogout = () => {
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) return;

        try {
            const { exp } = jwtDecode(token);
            const timeout = exp * 1000 - Date.now();

            if (timeout <= 0) {
                dispatch(logout());
            } else {
                const timer = setTimeout(() => {
                    dispatch(logout());
                    alert('Session expired. Please login again.');
                }, timeout);
                return () => clearTimeout(timer);
            }
        } catch {
            dispatch(logout());
        }
    }, [token, dispatch]);

    return null;
};

export default AutoLogout;
