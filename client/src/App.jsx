import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPanelPage from './pages/AdminPanelPage';
import ProtectedRoute from './components/ProtectedRoute';
import AutoLogout from './components/AutoLogout';
import DepositWithdrawal from "./pages/DepositWithdrawal.jsx";
import {Toaster} from "react-hot-toast";

function App() {
    return (
        <Router>
            <AutoLogout />
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transaction"
                    element={<ProtectedRoute><DepositWithdrawal /></ProtectedRoute>}
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPanelPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;
