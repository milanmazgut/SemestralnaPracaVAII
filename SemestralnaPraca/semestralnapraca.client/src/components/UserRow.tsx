import React from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserRowProps {
  user: User;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button
          className="btn btn-primary btn-sm me-2"
          onClick={() => onEdit(user.id)}
        >
          Upraviť
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(user.id)}
        >
          Zmazať
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
