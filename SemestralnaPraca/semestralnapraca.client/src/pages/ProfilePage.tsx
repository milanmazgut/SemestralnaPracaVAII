import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/Auth/UserProfile", {
          withCredentials: true,
        });
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (error: any) {
        setErrorMessage("Nepodarilo sa načítať profil.");
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    if (profile) {
      setEditedProfile(profile);
      setEditMode(true);
    }
  };

  const handleCancelClick = () => {
    if (profile) {
      setEditedProfile(profile);
    }
    setEditMode(false);
    setErrorMessage("");
  };

  const handleSaveClick = async () => {
    setErrorMessage("");

    try {
      if (!profile || !profile.id) {
        setErrorMessage("Neplatný používateľský profil.");
        return;
      }

      const response = await axios.put(
        "/api/Auth/EditUser",
        {
          Id: profile.id,
          Name: editedProfile.name,
          Email: editedProfile.email,
          Address: editedProfile.address,
          Role: editedProfile.role,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setProfile(editedProfile);
        setEditMode(false);
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Nepodarilo sa uložiť zmeny.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  if (!profile) {
    return <div className="container mt-5">Načítavam profil...</div>;
  }

  return (
    <div className="container-lg mt-5">
      <h2>Môj profil</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {!editMode ? (
        <div className="card p-4">
          <p>
            <strong>Meno:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Adresa:</strong> {profile.address}
          </p>
          <p>
            <strong>Rola:</strong> {profile.role}
          </p>
          <div className="d-flex">
            <button className="btn btn-primary" onClick={handleEditClick}>
              Upraviť
            </button>
            <Link className="btn btn-primary" to="/mojeObjednavky">
              Moje objednavky
            </Link>
          </div>
        </div>
      ) : (
        <div className="card p-4">
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
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Adresa:
            </label>
            <input
              type="text"
              className="form-control"
              name="address"
              id="address"
              value={editedProfile.address}
              onChange={handleChange}
            />
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
              onChange={handleChange}
              disabled
            />
          </div>

          <button className="btn btn-success" onClick={handleSaveClick}>
            Uložiť
          </button>

          <button className="btn btn-secondary" onClick={handleCancelClick}>
            Zrušiť
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
