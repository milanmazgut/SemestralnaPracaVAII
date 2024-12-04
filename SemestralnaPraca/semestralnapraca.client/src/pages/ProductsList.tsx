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

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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

  return (
    <div className="container-lg mt-5">
      <h1 className="display-4">Iné výrobky</h1>
      <p className="lead">
        Okrem oplechovania komínov ponúkame aj široký sortiment iných
        klampiarskych produktov, ktoré sú navrhnuté tak, aby zabezpečili ochranu
        a estetický vzhľad vašich budov.
      </p>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4">
        {products.map((product) => (
          <ProductCardWithImage
            key={product.id}
            image={product.imageUrl}
            title={product.name}
            description={product.description}
            link={"/detail/" + product.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
