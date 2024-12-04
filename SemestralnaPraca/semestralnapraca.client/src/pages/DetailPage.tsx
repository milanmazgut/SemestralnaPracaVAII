import axios from "axios";
import { useEffect, useState } from "react";
import DetailPageComponent from "../components/DetailPageComponent";
import { useParams } from "react-router-dom";

interface Product {
  name: string;
  description: string;
  imageUrl: string;
}

const DetailPage = () => {
  const [product, setProduct] = useState<Product | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("/api/Product/get", {
          params: { id },
        });
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching the product", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return (
    <div>
      {product && (
        <DetailPageComponent
          title={product.name}
          description={product.description}
          imageUrl={product.imageUrl}
        />
      )}
    </div>
  );
};

export default DetailPage;
