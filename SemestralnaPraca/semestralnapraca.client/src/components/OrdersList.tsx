import OrderTable from "./OrderTable";

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

interface OrderState {
  id: number;
  name: string;
}

interface OrdersListProps {
  orders: Order[];
  isAdmin?: boolean;
  onCancelOrder?: (orderId: number) => void;
  onChangeOrderState?: (orderId: number, newStateId: number) => void;
  onDeleteOrder?: (orderId: number) => void;
  states: OrderState[];
}

const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  isAdmin = false,
  onCancelOrder,
  onChangeOrderState,
  onDeleteOrder,
  states,
}) => {
  if (orders.length === 0) {
    return (
      <div className="mt-5">
        <h2>Žiadne objednávky</h2>
      </div>
    );
  }

  return (
    <>
      {orders.map((order) => (
        <div className="card mb-4" key={order.id}>
          <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <strong>Objednávka #{order.id}</strong> –{" "}
              {new Date(order.date).toLocaleString()}
            </div>
            {isAdmin && order.userEmail !== "" ? (
              <div className="mt-2 mt-md-0 text-md-end">
                <strong>Email používateľa:</strong> {order.userEmail}
              </div>
            ) : null}
          </div>
          <div className="card-body">
            {isAdmin ? (
              <div className="mb-3 d-flex flex-column flex-md-row align-items-start gap-3">
                <div>
                  <label className="me-2">
                    <strong>Stav:</strong>
                  </label>
                  <select
                    value={order.stateId || ""}
                    onChange={(e) => {
                      const selectedValue = parseInt(e.target.value, 10);
                      if (onChangeOrderState) {
                        onChangeOrderState(order.id, selectedValue);
                      }
                    }}
                  >
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (onDeleteOrder) {
                        onDeleteOrder(order.id);
                      }
                    }}
                  >
                    Vymazať objednávku
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>Stav:</strong> {order.state}
                </p>
                {order.state === "Vytvorena" && (
                  <button
                    className="btn btn-danger mb-3"
                    onClick={() => onCancelOrder && onCancelOrder(order.id)}
                  >
                    Stornovať objednávku
                  </button>
                )}
              </>
            )}

            <OrderTable order={order} />
          </div>
        </div>
      ))}
    </>
  );
};

export default OrdersList;
