import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import RoofDetailPage from "./pages/RoofDetailPage";
import ChimneyDetailPage from "./pages/ChimneyDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import useAuthStore from "./zustand/authStore";
import axios from "axios";
import { useEffect } from "react";
import ProductsList from "./pages/ProductsList";
import DetailPage from "./pages/DetailPage";
import UsersTable from "./components/UsersTable";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("/api/Auth/UserProfile", {
          withCredentials: true,
        });
        const user = response.data;
        login(user);
      } catch (error) {
        console.log("Používateľ nie je prihlásený");
      }
    };

    checkUser();
  }, [login]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/strechy" element={<RoofDetailPage />} />
        <Route path="/kominy" element={<ChimneyDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/produkty" element={<ProductsList />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="Admin">
              <UsersTable />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
