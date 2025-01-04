interface Address {
  street: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  address: Address | null;
}

interface EditUserFormProps {
  editedProfile: UserProfile;
  handleSaveClick: () => void;
  handleCancelClick: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  editedProfile,
  handleSaveClick,
  handleCancelClick,
  handleInputChange,
}) => {
  return (
    <div className="card shadow-sm p-4 mb-4">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Meno:
        </label>
        <input
          type="text"
          className="form-control"
          name="name"
          id="name"
          value={editedProfile.name}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email:
        </label>
        <input
          type="email"
          className="form-control"
          name="email"
          id="email"
          value={editedProfile.email}
          onChange={handleInputChange}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="address.street" className="form-label">
            Ulica:
          </label>
          <input
            type="text"
            className="form-control"
            name="address.street"
            id="address.street"
            value={editedProfile.address?.street || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="address.city" className="form-label">
            Mesto:
          </label>
          <input
            type="text"
            className="form-control"
            name="address.city"
            id="address.city"
            value={editedProfile.address?.city || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="address.postalCode" className="form-label">
            PSČ:
          </label>
          <input
            type="text"
            className="form-control"
            name="address.postalCode"
            id="address.postalCode"
            value={editedProfile.address?.postalCode || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="address.phone" className="form-label">
            Telefón:
          </label>
          <input
            type="text"
            className="form-control"
            name="address.phone"
            id="address.phone"
            value={editedProfile.address?.phone || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="role" className="form-label">
          Rola:
        </label>
        <input
          type="text"
          className="form-control"
          name="role"
          id="role"
          value={editedProfile.role}
          disabled
        />
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-primary me-2" onClick={handleSaveClick}>
          Uložiť
        </button>
        <button className="btn btn-secondary" onClick={handleCancelClick}>
          Zrušiť
        </button>
      </div>
    </div>
  );
};

export default EditUserForm;
