import React, { useState, useEffect } from "react";
import axios from "axios";
import UserRow from "./UserRow";
import EditUserModal from "./EditUserModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/Auth/GetAllUsers");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`/api/Auth/DeleteUser/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async (updatedUser: User) => {
    try {
      await axios.put("/api/Auth/EditUser", updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Management</h2>
      <table className="table table-striped table-bordered mt-3">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>

      {isModalOpen && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersTable;
