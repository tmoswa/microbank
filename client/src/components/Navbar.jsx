import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
    const role = useSelector(state => state.auth.role);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="text-xl font-bold">Microbank</div>
            <div className="flex gap-4">
                {role === 'admin' ? (
                    <Link to="/admin" className="hover:underline">Admin Panel</Link>
                ) : (
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
