import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children, requiredRole }) {
    const token = useSelector(state => state.auth.token);
    const role = useSelector(state => state.auth.role);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;