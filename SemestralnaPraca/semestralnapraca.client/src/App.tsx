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
import UsersTable from "./pages/UsersTable";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import EditProductPage from "./pages/EditProductPage";
import AddProductPage from "./pages/AddProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("/api/Auth/UserProfile", {
          withCredentials: true,
        });
        const user = response.data;
        login(user);
      } catch (error) {
        logout();
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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/mojeObjednavky" element={<OrdersPage />} />
        <Route path="/kosik" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="admin/products/edit/:id" element={<EditProductPage />} />
        <Route path="/admin/products/add" element={<AddProductPage />} />
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
