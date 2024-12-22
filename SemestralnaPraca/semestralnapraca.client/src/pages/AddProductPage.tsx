import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

/** Rozhranie pre nový produkt */
interface NewProduct {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price?: number; // ak potrebuješ cenu
}

const AddProductPage: React.FC = () => {
  // Kontrola, či je používateľ admin
  const { user } = useAuthStore();
  const isAdmin = user?.role === "Admin";

  // React Router navigácia
  const navigate = useNavigate();

  // Lokálny stav pre formulár
  const [product, setProduct] = useState<NewProduct>({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    price: 0,
  });

  // Chybové hlásenie (ak zlyhá request)
  const [error, setError] = useState<string>("");

  // Ak nie je admin, môžeme buď zobraziť 403 správu, alebo presmerovať
  if (!isAdmin) {
    return (
      <div className="container mt-4">Nemáte oprávnenie pridať produkt.</div>
    );
  }

  /** Spracovanie zmien v inputoch */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** Odoslanie formulára na server */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/Product/add", product);
      // Po úspešnom pridaní presmerujeme na /products alebo kam potrebuješ
      navigate("/produkty");
    } catch (err: any) {
      console.error("Chyba pri pridávaní produktu:", err);
      setError("Nepodarilo sa pridať produkt. Skúste to znova.");
    }
  };

  return (
    <div className="container my-4">
      <h2>Pridať nový produkt</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Názov */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Názov produktu
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Popis */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Popis
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={3}
            value={product.description}
            onChange={handleChange}
          />
        </div>

        {/* URL obrázka */}
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">
            URL obrázka
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            className="form-control"
            value={product.imageUrl}
            onChange={handleChange}
          />
        </div>

        {/* Kategória */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Kategória
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Vyber kategóriu --</option>
            <option value="Výroba oplechovaní">Výroba oplechovaní</option>
            <option value="Komínové striešky a kryty">
              Komínové striešky a kryty
            </option>
            <option value="Klampiarske výrobky">Klampiarske výrobky</option>
            <option value="Neštandardné klampiarske výrobky">
              Neštandardné klampiarske výrobky
            </option>
          </select>
        </div>

        {/* Cena (ak používaš) */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Cena
          </label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleChange}
            step="0.01"
          />
        </div>

        <button type="submit" className="btn btn-success">
          Pridať produkt
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/produkty")}
        >
          {" "}
          Zrušiť{" "}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
