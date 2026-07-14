import UserCard from './UserCard.jsx';

export default function UserGrid({ users, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="text-slate-500 text-center py-10">Cargando usuarios...</p>;
  }

  if (!users.length) {
    return (
      <p className="text-slate-500 text-center py-10">
        No hay usuarios registrados todavía.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {users.map((user) => (
        <UserCard key={user._id} user={user} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}