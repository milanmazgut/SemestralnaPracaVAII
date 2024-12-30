import React, { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  parameter: string;
  total: number;
}

interface Order {
  id: number;
  date: string;
  state: string;
  items: OrderItem[];
  total: number;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/Orders/userOrders", {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error: any) {
        setErrorMessage("Nepodarilo sa načítať objednávky.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    try {
      // API volanie na stornovanie objednavky
      await axios.post(
        `/api/Orders/cancel/${orderId}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      setErrorMessage("Nepodarilo sa stornovať objednávku.");
    }
  };

  if (loading) {
    return <div className="container mt-5">Načítavam objednávky...</div>;
  }

  if (errorMessage) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{errorMessage}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mt-5">
        <h2>Nemáte žiadne objednávky</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Moje objednávky</h2>
      {orders.map((order) => (
        <div className="card mb-4" key={order.id}>
          <div className="card-header">
            <strong>Objednávka #{order.id}</strong> –{" "}
            {new Date(order.date).toLocaleString()}
          </div>
          <div className="card-body">
            <p>
              <strong>Stav:</strong> {order.state}
            </p>
            {order.state === "Vytvorena" && (
              <button
                className="btn btn-danger mb-3"
                onClick={() => handleCancelOrder(order.id)}
              >
                Stornovať objednávku
              </button>
            )}

            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Produkt</th>
                  <th>Parametre</th>
                  <th>Množstvo</th>
                  <th>Cena za kus</th>
                  <th>Spolu</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.parameter}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toFixed(2)} €</td>
                    <td>{item.total.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-end">
                    <strong>Celkom:</strong>
                  </td>
                  <td>
                    <strong>{order.total.toFixed(2)} €</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
