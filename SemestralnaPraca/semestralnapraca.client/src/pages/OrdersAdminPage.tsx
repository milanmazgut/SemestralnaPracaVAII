import React, { useEffect, useState } from "react";
import axios from "axios";
import OrdersList from "../components/OrdersList";
import Loader from "../components/Loader";

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

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get("/api/Orders/all", {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error: any) {
        setErrorMessage("Nepodarilo sa načítať všetky objednávky.");
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
        setErrorMessage("Nepodarilo sa načítať všetky objednávky.");
      }
    };

    fetchAllOrders();
    fetchOrderStates();
  }, []);

  const handleChangeOrderState = async (
    orderId: number,
    newStateId: number
  ) => {
    try {
      await axios.put(
        `/api/Orders/state/${orderId}`,
        { newStateId },
        { withCredentials: true }
      );
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId ? { ...o, stateId: newStateId } : o
        )
      );
      alert("Stav objednávky bol úspešne zmenený.");
    } catch (error) {
      setErrorMessage("Nepodarilo sa zmeniť stav objednávky.");
    }
  };

  if (loading) {
    return <Loader />;
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
      <h2>Administrácia – všetky objednávky</h2>
      <OrdersList
        orders={orders}
        isAdmin={true}
        onChangeOrderState={handleChangeOrderState}
        states={states}
      />
    </div>
  );
};

export default AdminOrdersPage;
