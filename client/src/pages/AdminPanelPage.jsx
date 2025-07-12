import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useClient } from '../hooks/useClient';
import Navbar from '../components/Navbar';

function AdminPanelPage() {
    const { token, handleLogout } = useAuth();
    const { clients, message, fetchClients, toggleBlacklist } = useClient(token);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Navbar />
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Clients List</h2>
                <table className="w-full border">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Blacklisted</th>
                        <th className="p-2 text-left">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map((client) => (
                        <tr key={client.id} className="border-t">
                            <td className="p-2">{client.id}</td>
                            <td className="p-2">{client.user.fullname}</td>
                            <td className="p-2">{client.user.email}</td>
                            <td className="p-2">{client.blacklisted ? 'Yes' : 'No'}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => toggleBlacklist(client.id, client.blacklisted)}
                                    className={`px-3 py-1 rounded text-white ${client.blacklisted ? 'bg-green-500' : 'bg-red-500'}`}
                                >
                                    {client.blacklisted ? 'Activate' : 'Blacklist'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {message && <div className="mt-4 text-center text-sm text-gray-700">{message}</div>}
        </div>
    );
}

export default AdminPanelPage;