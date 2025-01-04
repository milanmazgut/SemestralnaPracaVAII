interface UserProfile {
  id: string;
  name: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  role: string;
}

interface EditUserFormProps {
  editedProfile: UserProfile;
  handleSaveClick: () => void;
  handleCancelClick: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  editedProfile,
  handleSaveClick,
  handleCancelClick,
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
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="street" className="form-label">
            Ulica:
          </label>
          <input
            type="text"
            className="form-control"
            name="street"
            id="street"
            value={editedProfile.street}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="city" className="form-label">
            Mesto:
          </label>
          <input
            type="text"
            className="form-control"
            name="city"
            id="city"
            value={editedProfile.city}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="postalCode" className="form-label">
            PSČ:
          </label>
          <input
            type="text"
            className="form-control"
            name="postalCode"
            id="postalCode"
            value={editedProfile.postalCode}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="phone" className="form-label">
            Telefón:
          </label>
          <input
            type="text"
            className="form-control"
            name="phone"
            id="phone"
            value={editedProfile.phone}
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
