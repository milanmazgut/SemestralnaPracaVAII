import React from "react";
import { Link } from "react-router-dom";
import useCartStore from "../zustand/cartStore";

const CartPage: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);

  // Celková suma
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: number,
    dimensionsKey: string
  ) => {
    const newQty = parseInt(e.target.value, 10);
    updateItemQuantity(productId, dimensionsKey, newQty);
  };

  if (items.length === 0) {
    return (
      <div className="container mt-5">
        <h2>Váš košík je prázdny</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Váš nákupný košík</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-secondary">
            <tr>
              <th>Produkt</th>
              <th>Parametre</th>
              <th>Cena (ks)</th>
              <th>Množstvo</th>
              <th>Spolu</th>
              <th style={{ width: "50px" }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const totalForLine = item.price * item.quantity;
              const key = item.productId + (item.dimensionsKey || "");
              return (
                <tr key={key}>
                  <td>{item.name}</td>
                  <td>
                    {item.dimensions && item.dimensions.length > 0
                      ? item.dimensions.join(" × ")
                      : "–"}
                  </td>
                  <td>{item.price.toFixed(2)} €</td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm mx-auto"
                      style={{ maxWidth: "80px" }}
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          e,
                          item.productId,
                          item.dimensionsKey ?? ""
                        )
                      }
                    />
                  </td>
                  <td>{totalForLine.toFixed(2)} €</td>
                  <td>
                    <button
                      className="btn btn-link text-danger p-0"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Naozaj chcete odstrániť položku z košíka?"
                          )
                        ) {
                          removeItem(item.productId, item.dimensionsKey);
                        }
                      }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="row align-items-center mt-4">
        <div className="col-auto mb-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              if (window.confirm("Naozaj chcete vyčistiť košík?")) {
                clearCart();
              }
            }}
          >
            Vyčistiť košík
          </button>
        </div>

        <div className="col text-center mb-2">
          <h5 className="mb-0">Celková suma: {totalPrice.toFixed(2)} €</h5>
        </div>

        <div className="col-auto mb-2">
          <Link to="/checkout" className="btn btn-primary">
            Pokračovať k objednávke
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
