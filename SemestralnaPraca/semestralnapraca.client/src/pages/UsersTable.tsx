import React, { useState, useEffect } from "react";
import axios from "axios";
import UserRow from "../components/UserRow";
import EditUserModal from "../components/EditUserModal";

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
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/Auth/GetAllUsers", {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Chyba pri ziskavani uzivatelov:", error);
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

  const handleSave = (updatedUser: User) => {
    setIsModalOpen(false);
    setEditingUser(null);

    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );

    setSuccessMessage("Používateľ bol úspešne upravený!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm("Naozaj chcete zmazať používateľa?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/Auth/DeleteUser/${userId}`, {
        withCredentials: true,
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Chyba pri mazaní používateľa:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Správa používateľov</h2>

      {successMessage && (
        <div className="alert alert-success my-3">{successMessage}</div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3">
          <thead className="thead-dark">
            <tr>
              <th>Meno</th>
              <th>Email</th>
              <th>Rola</th>
              <th>Akcie</th>
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
      </div>

      {isModalOpen && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default UsersTable;
