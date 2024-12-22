import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCardWithImage from "../components/ProductCardWithImage";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

/** Rozhranie produktu */
interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price?: number;
}

/** Pomocná funkcia na odstránenie diakritiky */
const removeDiacritics = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useAuthStore();
  const isAdmin = user?.role === "Admin";

  // Vyhľadávanie a kategória (klientske filtrovanie)
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const navigate = useNavigate();

  /** Načítanie všetkých produktov z API */
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/Product/getAll");
      setProducts(response.data);
    } catch (err) {
      console.error("Chyba pri načítaní produktov:", err);
      setError("Nepodarilo sa načítať produkty.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /** Keď admin klikne na ikonku ceruzky */
  const handleEditProduct = (id: number) => {
    navigate(`/admin/products/edit/${id}`);
  };

  /** Keď admin klikne na ikonku koša */
  const handleDeleteProduct = async (id: number) => {
    const confirmed = window.confirm(
      "Naozaj si želáte odstrániť tento produkt?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/Product/delete/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Chyba pri mazaní produktu:", err);
      alert("Mazanie produktu zlyhalo.");
    }
  };

  /** Lokálny filter */
  const filteredProducts = products.filter((product) => {
    const normalizedProductName = removeDiacritics(product.name);
    const normalizedSearch = removeDiacritics(searchTerm);
    const matchesSearch = normalizedProductName.includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <div>Načítavanie produktov...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container my-4">
      <h2>Zoznam produktov</h2>

      {isAdmin && (
        <button
          className="btn btn-success mb-3"
          onClick={() => navigate("/admin/products/add")}
        >
          Pridať nový produkt
        </button>
      )}

      <div className="row mb-3">
        <div className="col-sm-6 mb-2 mb-sm-0">
          <label htmlFor="searchInput" className="form-label">
            Vyhľadávanie
          </label>
          <input
            type="text"
            id="searchInput"
            className="form-control"
            placeholder="Hľadaj podľa názvu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-sm-6">
          <label htmlFor="categorySelect" className="form-label">
            Filter podľa kategórie
          </label>
          <select
            id="categorySelect"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Všetky kategórie</option>
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
      </div>

      {/* Zoznam kariet */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 align-items-stretch">
        {filteredProducts.map((product) => (
          <div className="col" key={product.id}>
            <ProductCardWithImage
              id={product.id}
              image={product.imageUrl}
              title={product.name}
              description={product.description}
              link={`/detail/${product.id}`}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
