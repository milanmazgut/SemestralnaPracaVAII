import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditUserForm from "../components/EditUserForm";
import Loader from "../components/Loader";

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

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
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
          Street: editedProfile.street,
          City: editedProfile.city,
          PostalCode: editedProfile.postalCode,
          Phone: editedProfile.phone,
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

  if (!profile) {
    return <Loader />;
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="mb-4 text-center">Môj profil</h2>

          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          {!editMode ? (
            <div className="card shadow-sm p-4 mb-4">
              <div className="mb-3">
                <strong>Meno:</strong> {profile.name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {profile.email}
              </div>
              <div className="mb-3">
                <strong>Ulica:</strong> {profile.street}
              </div>
              <div className="mb-3">
                <strong>Mesto:</strong> {profile.city}
              </div>
              <div className="mb-3">
                <strong>PSČ:</strong> {profile.postalCode}
              </div>
              <div className="mb-3">
                <strong>Telefón:</strong> {profile.phone}
              </div>
              <div className="mb-3">
                <strong>Rola:</strong> {profile.role}
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-primary me-2"
                  onClick={handleEditClick}
                >
                  Upraviť
                </button>
                <Link className="btn btn-primary" to="/mojeObjednavky">
                  Moje objednávky
                </Link>
              </div>
            </div>
          ) : (
            <EditUserForm
              editedProfile={editedProfile}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
