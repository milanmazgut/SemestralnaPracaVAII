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

interface OrderTableProps {
  order: Order;
}

const OrderTable: React.FC<OrderTableProps> = ({ order }) => {
  return (
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
  );
};

export default OrderTable;
