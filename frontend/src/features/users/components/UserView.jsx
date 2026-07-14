import { useEffect, useState, useCallback } from 'react';
import UserHeader from './UserHeader.jsx';
import UserGrid from './UserGrid.jsx';
import UserModal from './UserModal.jsx';
import { getUsers, deleteUser } from '../../../shared/api/usersClient.js';

export default function UserView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = useCallback(async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getUsers(query ? { search: query } : undefined);
      setUsers(data.data || data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchUsers(search), 400);
    return () => clearTimeout(timeout);
  }, [search, fetchUsers]);

  const handleNew = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`¿Eliminar al usuario "${user.nombre} ${user.apellido}"?`)) return;
    try {
      await deleteUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo eliminar el usuario.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <UserHeader search={search} onSearchChange={setSearch} onNew={handleNew} />

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>
      )}

      <div className="mt-6">
        <UserGrid users={users} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => fetchUsers(search)}
        editingUser={editingUser}
      />
    </div>
  );
}
