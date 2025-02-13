import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const validatePassword = (password: string): string => {
    const lengthRequirement = password.length >= 8;
    const uppercaseRequirement = /[A-Z]/.test(password);
    const lowercaseRequirement = /[a-z]/.test(password);
    const numberRequirement = /[0-9]/.test(password);

    if (!lengthRequirement) {
      return "Heslo musí mať minimálne 8 znakov.";
    } else if (!uppercaseRequirement) {
      return "Heslo musí obsahovať aspoň jedno veľké písmeno.";
    } else if (!lowercaseRequirement) {
      return "Heslo musí obsahovať aspoň jedno malé písmeno.";
    } else if (!numberRequirement) {
      return "Heslo musí obsahovať aspoň jedno číslo.";
    } else {
      return "";
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const passwordError = validatePassword(newPassword);
    setErrorMessage(passwordError);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setErrorMessage("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Heslá sa nezhodujú.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/Auth/Register",
        {
          name,
          email,
          password,
          confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        const errorMessages = [];
        for (let key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMessages.push(errors[key]);
          }
        }
        setErrorMessage(errorMessages.join(" "));
      } else {
        setErrorMessage("Registrácia zlyhala.");
      }
    }
  };

  return (
    <div className="container-lg">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-lg-5 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Registrácia</h3>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Meno
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Emailová adresa
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Heslo
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Potvrďte heslo
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Registrovať sa
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <div className="text-muted">
                Už máte účet? <Link to="/login">Prihláste sa</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
