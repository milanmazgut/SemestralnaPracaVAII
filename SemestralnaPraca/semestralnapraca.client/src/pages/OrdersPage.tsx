import React, { useEffect, useState } from "react";
import axios from "axios";
import OrdersList from "../components/OrdersList";

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
  stateId: number;
  state: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);

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

    const fetchOrderStates = async () => {
      try {
        const res = await axios.get("/api/Orders/states", {
          withCredentials: true,
        });
        setStates(res.data);
      } catch (error: any) {
        setErrorMessage("Nepodarilo sa načítať objednávky.");
      }
    };

    fetchOrders();
    fetchOrderStates();
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    const confirmCancel = window.confirm(
      "Ste si istý, že chcete stornovať túto objednávku?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await axios.put(
        `/api/Orders/cancel/${orderId}`,
        { orderId },
        {
          withCredentials: true,
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, state: "Stornovaná" } : order
        )
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

  return (
    <div className="container mt-5">
      <h2>Moje objednavky</h2>
      <OrdersList
        orders={orders}
        isAdmin={false}
        onCancelOrder={handleCancelOrder}
        states={states}
      />
    </div>
  );
};

export default OrdersPage;
