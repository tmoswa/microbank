import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        const { sub: user, role = 'client', exp } = decoded;

        // Check expiration
        const now = Date.now() / 1000;
        if (exp && now > exp) {
            console.warn('Token expired');
            return { user: null, role: null, expired: true };
        }

        return { user, role, expired: false };
    } catch (e) {
        console.warn('Invalid token');
        return { user: null, role: null, expired: true };
    }
};

const token = localStorage.getItem('token');
const { user, role, expired } = token ? decodeToken(token) : { user: null, role: null, expired: true };

const initialState = {
    token: expired ? null : token,
    user: expired ? null : user,
    role: expired ? null : role,
    loading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            const { token } = action.payload;
            localStorage.setItem('token', token);
            const { user, role, expired } = decodeToken(token);

            if (expired) {
                state.token = null;
                state.user = null;
                state.role = null;
                return;
            }

            state.token = token;
            state.user = user;
            state.role = role;
        },
        logout(state) {
            localStorage.removeItem('token');
            state.token = null;
            state.user = null;
            state.role = null;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
