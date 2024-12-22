import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    name: "",
    email: "",
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
      // Tu predpokladáme, že máte endpoint na úpravu profilu.
      // Momentálne vo vašom kóde je EditUser iba pre admina a potrebuje ID používateľa.
      // Ak chcete, aby sa bežný používateľ mohol upraviť, je potrebné buď:
      // 1. Umožniť EditUser endpointu prijať prihláseného používateľa a zmeniť bez ID
      // alebo
      // 2. Vrátiť aj Id v UserProfile a poslať ho sem.

      // PRÍKLAD: Ak by ste ID užívateľa v UserProfile nevracali, treba to upraviť na serveri.
      // Tu predpokladáme, že pridáte ID do UserProfile odpovede. Napr.:
      // return Ok(new { id = user.Id, name = user.Name, email = user.Email, role = user.Role });
      //
      // Potom by ste mali profil s `id`.
      //
      // Príklad PUT požiadavky:
      if (!profile) return;

      const response = await axios.put(
        "/api/Auth/EditUser",
        {
          Id: (profile as any).id, // ak id nevraciate, treba doplniť na backende
          Name: editedProfile.name,
          Email: editedProfile.email,
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
    return <div>Načítavam profil...</div>;
  }

  return (
    <div className="container-lg">
      <h2>Môj profil</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {!editMode ? (
        <div>
          <p>
            <strong>Meno:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Rola:</strong> {profile.role}
          </p>

          <button className="btn btn-primary" onClick={handleEditClick}>
            Upraviť
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-3">
            <label className="form-label">Meno:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={editedProfile.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rola:</label>
            <input
              type="text"
              className="form-control"
              name="role"
              value={editedProfile.role}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-success me-2" onClick={handleSaveClick}>
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
