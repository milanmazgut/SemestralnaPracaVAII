import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCardWithImage from "../components/ProductCardWithImage";

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  link?: string;
}

// Pomocná funkcia na odstránenie diakritiky
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

  // Hodnoty formulára
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/Product/getAll");
        setProducts(response.data);
      } catch (error) {
        console.error("Chyba pri načítaní produktov:", error);
        setError("Nepodarilo sa načítať produkty.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Načítavanie produktov...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filtrovanie (lokálne)
  const filteredProducts = products.filter((product) => {
    const normalizedName = removeDiacritics(product.name);
    const normalizedSearch = removeDiacritics(searchTerm);
    const matchesSearch = normalizedName.includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-lg mt-5">
      <h1 className="display-4">Iné výrobky</h1>
      <p className="lead">
        Okrem oplechovania komínov ponúkame aj široký sortiment iných
        klampiarskych produktov, ktoré sú navrhnuté tak, aby zabezpečili ochranu
        a estetický vzhľad vašich budov.
      </p>

      <div className="row mb-4">
        <div className="col-sm-6 mb-3 mb-sm-0">
          <label htmlFor="searchInput" className="form-label">
            Vyhľadávanie
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search" aria-hidden="true"></i>
            </span>
            <input
              type="text"
              id="searchInput"
              className="form-control"
              placeholder="Hľadaj podľa názvu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-sm-6">
          <label htmlFor="categorySelect" className="form-label">
            Filter podľa kategórie
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-funnel" aria-hidden="true"></i>
            </span>
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
      </div>

      {/* Zoznam produktov */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4 align-items-stretch">
        {products.map((product) => (
          <div className="col" key={product.id}>
            <ProductCardWithImage
              image={product.imageUrl}
              title={product.name}
              description={product.description}
              link={"/detail/" + product.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
