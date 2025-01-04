import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCartStore from "../zustand/cartStore";

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  numberOfParameters: number;
  price: number;
}

type Dimensions = string[];

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`/api/Product/${id}`);
        const data: Product = response.data;
        setProduct(data);

        if (data.numberOfParameters > 0) {
          setDimensions(Array(data.numberOfParameters).fill(""));
        }
      } catch (error) {
        console.error("Chyba pri načítaní produktu:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleDimensionChange = (index: number, value: string) => {
    const updated = [...dimensions];
    updated[index] = value;
    setDimensions(updated);
  };

  const calculateFinalPrice = (): number => {
    if (!product) return 0;

    if (product.numberOfParameters === 0) {
      return product.price;
    } else {
      const numericVals: number[] = dimensions.map((dim) => parseFloat(dim));

      if (numericVals.some((num) => isNaN(num) || num <= 0)) {
        return 0;
      }

      // Príklad pre 2 parametre (dĺžka, šírka)
      if (product.numberOfParameters === 2) {
        const [lengthCm, widthCm] = numericVals;

        const areaCm2 = lengthCm * widthCm;
        const areaM2 = areaCm2 / 10000;

        return areaM2 * product.price;
      }

      // Príklad pre 3 parametre (dĺžka, šírka, výška)
      if (
        product.numberOfParameters === 3 ||
        product.numberOfParameters === 4
      ) {
        const [lengthCm, widthCm, heightCm] = numericVals;

        // Výpočet plochy kvádra bez spodnej strany
        const topAreaCm2 = lengthCm * widthCm;
        const frontBackAreaCm2 = 2 * (lengthCm * heightCm);
        const leftRightAreaCm2 = 2 * (widthCm * heightCm);

        const totalAreaCm2 = topAreaCm2 + frontBackAreaCm2 + leftRightAreaCm2;

        const totalAreaM2 =
          product.numberOfParameters === 3
            ? (totalAreaCm2 / 10000) * 2.5
            : (totalAreaCm2 / 10000) * 1.2;

        // Vysledna cena
        return totalAreaM2 * product.price;
      }

      return product.price;
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.numberOfParameters > 0) {
      const emptyField = dimensions.some((dim) => !dim.trim());
      if (emptyField) {
        alert("Prosím, vyplňte všetky parametre produktu.");
        return;
      }
    }

    const finalPrice = calculateFinalPrice();
    if (finalPrice === 0) {
      alert("Prosím, skontrolujte zadané hodnoty parametrov.");
      return;
    }

    let dimensionsKey = "";
    if (dimensions.length > 0) {
      dimensionsKey = dimensions.join("x");
    }

    useCartStore.getState().addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      dimensionsKey,
      dimensions,
    });

    alert(
      `Produkt bol pridaný do košíka! Cena za kus: ${finalPrice.toFixed(2)} €`
    );
  };
  const finalPrice = calculateFinalPrice();

  if (!product) {
    return <div className="container-lg mt-5">Načítavam...</div>;
  }

  return (
    <div className="container-lg mt-5">
      <h1 className="display-4">{product.name}</h1>

      <div className="row mt-4">
        <div className="col-lg-6 mb-3">
          <img
            src={product.imageUrl}
            className="img-fluid"
            alt={product.name}
          />
        </div>

        <div className="col-lg-6">
          <h2>Popis produktu</h2>
          <p>{product.description}</p>

          {product.numberOfParameters === 0 && (
            <>
              <h4>Pevná cena: {finalPrice.toFixed(2)} €</h4>
              <button
                className="btn btn-success mt-3"
                onClick={handleAddToCart}
              >
                Vložiť do košíka
              </button>
            </>
          )}

          {product.numberOfParameters > 0 && (
            <>
              <h4>Vyplňte parametre produktu:</h4>
              {dimensions.map((value, index) => {
                let label = `Parameter ${index + 1}`;
                if (product.numberOfParameters === 2) {
                  label = index === 0 ? "Dĺžka (cm)" : "Šírka (cm)";
                } else if (product.numberOfParameters === 3) {
                  if (index === 0) label = "Dĺžka (cm)";
                  if (index === 1) label = "Šírka (cm)";
                  if (index === 2) label = "Výška (cm)";
                } else if (product.numberOfParameters === 4) {
                  if (index === 0) label = "Dĺžka (cm)";
                  if (index === 1) label = "Šírka (cm)";
                  if (index === 2) label = "Výška (cm)";
                  if (index === 3) label = "Sklon (°)";
                }
                return (
                  <div className="mb-3" key={index}>
                    <label className="form-label">{label}:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={value}
                      onChange={(e) =>
                        handleDimensionChange(index, e.target.value)
                      }
                      min="0"
                      step="any"
                      required
                    />
                  </div>
                );
              })}

              {finalPrice === 0 && (
                <div className="text-danger mb-3">
                  Prosím, skontrolujte zadané hodnoty parametrov.
                </div>
              )}

              <h4>
                Aktuálna cena podľa zadaných parametrov:{" "}
                {finalPrice > 0 ? finalPrice.toFixed(2) : "0.00"} €
              </h4>

              <button
                className="btn btn-success mt-3"
                onClick={handleAddToCart}
              >
                Vložiť do košíka
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
