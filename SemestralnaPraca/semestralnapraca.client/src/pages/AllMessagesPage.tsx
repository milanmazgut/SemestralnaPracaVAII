import React, { useEffect, useState } from "react";
import axios from "axios";

interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

const ContactMessagesAdminPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("/api/ContactMessage/getAll", {
          withCredentials: true,
        });
        setMessages(res.data);
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 401) {
            setError("Nie ste prihlásený.");
          } else if (err.response.status === 403) {
            setError("Prístup zamietnutý. Nemáte oprávnenie (Admin).");
          } else {
            setError("Nastala chyba pri načítaní správ.");
          }
        } else {
          setError("Server nedostupný.");
        }
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Správy z kontaktného formulára</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {!error && messages.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Meno</th>
                <th>Email</th>
                <th>Telefón</th>
                <th>Predmet</th>
                <th>Správa</th>
                <th>Dátum</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.fullName}</td>
                  <td>{msg.email}</td>
                  <td>{msg.phone || "-"}</td>
                  <td>{msg.subject}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!error && messages.length === 0 && (
        <p className="mt-4">Žiadne správy.</p>
      )}
    </div>
  );
};

export default ContactMessagesAdminPage;
