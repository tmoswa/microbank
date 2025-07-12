import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const decodeToken = (token) => {
    try {
        const { sub: user, role = 'client', exp } = jwtDecode(token);
        const now = Date.now() / 1000;
        if (exp && now > exp) {
            console.warn('Token expired');
            return { user: null, role: null, expired: true };
        }
        return { user, role, expired: false };
    } catch {
        console.warn('Invalid token');
        return { user: null, role: null, expired: true };
    }
};

const initialState = {
    token: null,
    user: null,
    role: null,
    loading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            const { token } = action.payload;
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