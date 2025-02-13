import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../zustand/authStore";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useAuthStore((state) => state.login);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/Auth/UserProfile", {
        withCredentials: true,
      });
      const user = response.data;
      login(user);
    } catch (error) {
      console.error("Chyba pri získavaní profilu používateľa:", error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/Auth/Login",
        {
          email,
          password,
          rememberMe,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        await fetchUserProfile();
        navigate("/");
      }
    } catch (error: any) {
      console.error("Prihlásenie zlyhalo:", error);
      alert(error.response?.data?.message || "Prihlásenie zlyhalo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-lg">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-lg-5 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Prihlásenie</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email alebo používateľské meno
                  </label>
                  <input
                    type="text"
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Zapamätať si ma
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-decoration-none">
                    Zabudnuté heslo?
                  </Link>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Prihlasujem..." : "Prihlásiť sa"}
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <div className="text-muted">
                Nemáte účet? <Link to="/register">Registrovať sa</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
