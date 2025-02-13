import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface NewProduct {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price?: number;
}

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState<NewProduct>({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    price: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("price", product.price?.toString() || "0");
      formData.append("imageUrl", product.imageUrl);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await axios.post("/api/Product/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

        <div
          className="dropzone mb-3"
          onClick={handleDivClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {selectedFile ? (
            <p>{selectedFile.name}</p>
          ) : (
            <p>Presuň sem obrázok alebo klikni a vyber súbor</p>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileSelect}
        />

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
          Zrušiť
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
