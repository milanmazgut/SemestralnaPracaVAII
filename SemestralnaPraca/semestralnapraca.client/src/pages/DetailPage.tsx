import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/** Rozhranie produktu */
interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  numberOfParameters: number; // 0 = žiadne parametre, >0 = potrebné zadať
  price: number;
  // Ak je to potrebné, môžeš pridať ďalšie vlastnosti
}

/** Typ pre parametre produktu */
type Dimensions = string[];

/** Typ pre chyby vo výpočte ceny */
interface PriceCalculationError {
  message: string;
}

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`/api/Product/${id}`);
        const data: Product = response.data;
        setProduct(data);

        // Ak má produkt parametre (napr. 2 alebo 3), vytvor pole: ["", ""] alebo ["", "", ""]
        if (data.numberOfParameters > 0) {
          setDimensions(Array(data.numberOfParameters).fill(""));
        }
      } catch (error) {
        console.error("Chyba pri načítaní produktu:", error);
        setError("Nepodarilo sa načítať produkt. Skúste to neskôr.");
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  /** Handler pre zmeny v poliach s parametrami (rozmery, atď.) */
  const handleDimensionChange = (index: number, value: string) => {
    const updated = [...dimensions];
    updated[index] = value;
    setDimensions(updated);
  };

  /**
   * Funkcia, ktorá vypočíta výslednú cenu podľa rozmerov:
   * - Ak numberOfParameters = 0, vráti priamo product.price
   * - Ak je 2 parametre (dĺžka, šírka), spočíta plochu v m² (dĺžka*šírka / 10000) a vynásobí product.price
   * - Ak je 3 parametre, vypočíta plochu kvádra bez spodnej strany
   * - Ak je 4 parametre, použije iný vzorec (napr. s klonom)
   */
  const calculateFinalPrice = (): number => {
    if (!product) return 0;

    if (product.numberOfParameters === 0) {
      // Žiadne parametre, pevnú cenu
      return product.price;
    } else {
      // Máme 1 a viac parametrov
      // Najprv parse-uj všetky parametre (napr. ["100","50"] -> [100, 50])
      const numericVals: number[] = dimensions.map((dim) => parseFloat(dim));

      // Ak je niektorá hodnota neplatná, vrátime 0
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
      if (product.numberOfParameters === 3) {
        const [lengthCm, widthCm, heightCm] = numericVals;

        // Výpočet plochy kvádra bez spodnej strany
        const topAreaCm2 = lengthCm * widthCm; // Horná plocha
        const frontBackAreaCm2 = 2 * (lengthCm * heightCm); // Predná a zadná plocha
        const leftRightAreaCm2 = 2 * (widthCm * heightCm); // Bočné plochy

        // Celková plocha v cm²
        const totalAreaCm2 = topAreaCm2 + frontBackAreaCm2 + leftRightAreaCm2;

        // Prevod na m²
        const totalAreaM2 =
          product.numberOfParameters === 3
            ? (totalAreaCm2 / 10000) * 2.5
            : (totalAreaCm2 / 10000) * 1.2;

        // Výsledná cena = totalAreaM2 * price
        return totalAreaM2 * product.price;
      }

      // Ak máš iný počet parametrov, doplň ďalšie vetvy
      // Inak defaultne
      return product.price;
    }
  };

  /** Kliknutie na „Vložiť do košíka“ */
  const handleAddToCart = () => {
    if (!product) return;

    // Ak je potrebné vyplniť parametre, skontrolujeme, či nie sú prázdne
    if (product.numberOfParameters > 0) {
      const emptyField = dimensions.some((dim) => !dim.trim());
      if (emptyField) {
        alert("Prosím, vyplňte všetky parametre produktu.");
        return;
      }
    }

    const finalPrice = calculateFinalPrice();

    // Kontrola, či cena nebola vypočítaná na 0
    if (finalPrice === 0) {
      alert("Prosím, skontrolujte zadané hodnoty parametrov.");
      return;
    }

    // Tu by si pridal logiku na vloženie do košíka (napr. volanie nejakého e-shop store)
    console.log("Produkt sa pridáva do košíka:", {
      product: product.name,
      basePrice: product.price,
      finalPrice,
      dimensions,
    });
    alert(`Produkt bol pridaný do košíka! Cena: ${finalPrice.toFixed(2)} €`);
  };

  // Ak sa produkt ešte nenačítal
  if (!product) {
    if (error) {
      return <div className="container mt-5 text-danger">{error}</div>;
    }
    return <div className="container mt-5">Načítavanie...</div>;
  }

  // Vypočítame finalPrice pri každom vykreslení
  const finalPrice = calculateFinalPrice();

  return (
    <div className="container-lg mt-5">
      {/* Názov */}
      <h1 className="display-4">{product.name}</h1>

      <div className="row mt-4">
        {/* Obrázok v ľavom stĺpci */}
        <div className="col-lg-6 mb-3">
          <img
            src={product.imageUrl}
            className="img-fluid"
            alt={product.name}
          />
        </div>

        {/* Informácie v pravom stĺpci */}
        <div className="col-lg-6">
          <h2>Popis produktu</h2>
          <p>{product.description}</p>

          {/* Ak numberOfParameters === 0, stačí ukázať pevnú cenu a tlačidlo */}
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

          {/* Ak > 0, zobrazíme polia na zadanie parametrov + počítame cenu dynamicky */}
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

              {/* Zobrazenie chybovej správy, ak je to potrebné */}
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
