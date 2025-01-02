import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../zustand/cartStore";
import useAuthStore from "../zustand/authStore";
import axios from "axios";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Obsah kosika
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // ked je user k dispozicii vypln meno a email
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
    } else {
      setFullName("");
      setEmail("");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      fullName,
      email,
      address,
      city,
      zip,
      phone,
      items,
    };
    console.log("Odosielam objednávku:", formData);

    try {
      const response = await axios.post("/api/Orders/add", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Objednávka úspešne vytvorená:", response.data);

      clearCart();
      alert("Vaša objednávka bola úspešne odoslaná!");
      navigate("/");
    } catch (error) {
      console.error("Chyba pri odosielaní objednávky:", error);
      alert("Nastala chyba pri odoslaní objednávky");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Objednávka</h2>
      <p className="text-muted">
        Vyplňte prosím vaše fakturačné údaje a adresu.
      </p>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="fullName" className="form-label">
            Meno a priezvisko
          </label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="col-12">
          <label htmlFor="address" className="form-label">
            Ulica a popisné číslo
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Ulica a popisné číslo"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="city" className="form-label">
            Mesto
          </label>
          <input
            type="text"
            className="form-control"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="zip" className="form-label">
            PSČ
          </label>
          <input
            type="text"
            className="form-control"
            id="zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">
            Telefón
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary">
            Odoslať objednávku
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
