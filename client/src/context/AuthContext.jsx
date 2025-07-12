import { useSelector } from 'react-redux';
import { createContext } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;