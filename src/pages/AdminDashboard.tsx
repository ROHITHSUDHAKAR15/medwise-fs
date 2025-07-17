import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${BACKEND_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
        // Check if current user is admin
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setIsAdmin(user.isAdmin === true);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  const handlePromote = async (id: number) => {
    try {
      await axios.patch(`${BACKEND_URL}/admin/users/${id}/promote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users => users.map(u => u.id === id ? { ...u, isAdmin: true } : u));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to promote user');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users => users.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (!isAdmin) {
    return <div className="text-center text-red-600 py-8">You are not authorized to view this page.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Admin</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                <td className="border px-4 py-2 space-x-2">
                  {!user.isAdmin && (
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handlePromote(user.id)}>
                      Promote
                    </button>
                  )}
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 