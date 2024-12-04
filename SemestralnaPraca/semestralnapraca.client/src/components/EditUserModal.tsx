import React, { useState } from "react";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "email") {
      setErrors({ ...errors, email: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    onSave(editingUser);
  };

  return (
    <div className="modal-overlay d-flex justify-content-center align-items-center">
      <div className="modal-dialog modal-content p-4">
        <h4>Edit User</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
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
            <label>Role:</label>
            <select
              className="form-control"
              name="role"
              value={editingUser.role}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
