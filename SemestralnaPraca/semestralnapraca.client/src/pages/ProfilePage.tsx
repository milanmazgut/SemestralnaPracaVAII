import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditUserForm from "../components/EditUserForm";
import Loader from "../components/Loader";

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

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    role: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      phone: "",
    },
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEditedProfile((prev) => ({
        ...prev,
        address: prev.address
          ? { ...prev.address, [addressField]: value }
          : { street: "", city: "", postalCode: "", phone: value },
      }));
    } else {
      setEditedProfile({
        ...editedProfile,
        [name]: value,
      });
    }
  };

  const handleSaveClick = async () => {
    setErrorMessage("");
    try {
      if (!profile || !editedProfile.address) {
        setErrorMessage("Neplatný používateľský profil.");
        return;
      }

      const response = await axios.put(
        "/api/Auth/update",
        {
          Id: profile.id,
          Name: editedProfile.name,
          Email: editedProfile.email,
          Street: editedProfile.address.street,
          City: editedProfile.address.city,
          PostalCode: editedProfile.address.postalCode,
          Phone: editedProfile.address.phone,
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
                <strong>Ulica:</strong> {profile.address?.street || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Mesto:</strong> {profile.address?.city || "N/A"}
              </div>
              <div className="mb-3">
                <strong>PSČ:</strong> {profile.address?.postalCode || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Telefón:</strong> {profile.address?.phone || "N/A"}
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
              handleInputChange={handleInputChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
