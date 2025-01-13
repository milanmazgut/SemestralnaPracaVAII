import React, { useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EditUserModalProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  onSave,
  onClose,
}) => {
  const [editingUser, setEditingUser] = useState<User>(user);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [serverError, setServerError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "email") {
      setErrors({ ...errors, email: "" });
      setServerError("");
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      setErrors({ email: "Prosím zadajte správny email." });
      return;
    }

    try {
      await axios.put("/api/Auth/EditUser", editingUser, {
        withCredentials: true,
      });
      onSave(editingUser);
    } catch (error: any) {
      console.error("Chyba pri ukladaní používateľa:", error);

      if (error.response && error.response.status === 409) {
        setServerError(error.response.data.message || "Email už existuje.");
      } else {
        setServerError("Nastala chyba pri ukladaní.");
      }
    }
  };

  return (
    <div className="modal-overlay d-flex justify-content-center align-items-center">
      <div className="modal-dialog modal-content p-4">
        <h4>Úprava používateľa</h4>

        {serverError && (
          <div className="alert alert-danger" role="alert">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Meno:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={editingUser.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              value={editingUser.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="form-group">
            <label>Rola:</label>
            <select
              className="form-control"
              name="role"
              value={editingUser.role}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Vyberte rolu
              </option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="modal-footer mt-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Zrušiť
            </button>
            <button type="submit" className="btn btn-success">
              Uložiť zmeny
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
