import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price?: number;
}

const EditProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await axios.get(`/api/Product/${productId}`);
      setProduct(response.data);
    } catch (err) {
      console.error(err);
      alert("Nepodarilo sa načítať produkt.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!product) return;
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSave = async () => {
    if (!product) return;
    try {
      await axios.put(`/api/Product/edit/${product.id}`, product);
      alert("Produkt úspešne upravený.");
      navigate("/produkty");
    } catch (err) {
      console.error(err);
      alert("Nepodarilo sa uložiť zmeny produktu.");
    }
  };

  if (!product) return <div>Načítavam...</div>;

  return (
    <div className="container my-4">
      <h2>Upraviť produkt</h2>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Názov
        </label>
        <input
          id="name"
          name="name"
          className="form-control"
          value={product.name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Popis
        </label>
        <input
          id="description"
          name="description"
          className="form-control"
          value={product.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="imageUrl" className="form-label">
          Obrázok
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          className="form-control"
          value={product.imageUrl}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Kategória
        </label>
        <input
          id="category"
          name="category"
          className="form-control"
          value={product.category}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        Uložiť
      </button>
      <button
        className="btn btn-secondary me-2"
        onClick={() => navigate("/produkty")}
      >
        Zrušiť
      </button>
    </div>
  );
};

export default EditProductPage;
