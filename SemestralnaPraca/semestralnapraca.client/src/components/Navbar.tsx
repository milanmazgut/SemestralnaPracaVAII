import { Link } from "react-router-dom";
import useAuthStore from "../zustand/authStore";
import axios from "axios";
import useCartStore from "../zustand/cartStore";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const itemsCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  const handleLogout = async () => {
    try {
      await axios.post("/api/Auth/Logout", null, { withCredentials: true });
      logout();
    } catch (error) {
      logout();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Klampiarské práce
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Domov
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/produkty">
                Produkty
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kontakt">
                Kontakt
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kosik">
                <i className="bi bi-cart-fill me-1"></i>
                Košík ({itemsCount})
              </Link>
            </li>
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-square me-2"></i>
                  {user?.name}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profil
                    </Link>
                  </li>

                  {user?.role === "Admin" && (
                    <li>
                      <Link className="dropdown-item" to="/users">
                        Správa používateľov
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item btn-primary btn-secondary"
                      onClick={handleLogout}
                    >
                      Odhlásiť sa
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-primary" to="/login">
                  Prihlásiť sa
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
