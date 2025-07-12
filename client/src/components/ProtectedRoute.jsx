import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, requiredRole }) {
    const { token, role } = useAuth();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;