import { useEffect, useState } from "react";
import "./MyOrders.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7000";
const API_URL = `${BASE_URL}/api/Order`;

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/user/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load orders.");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>View your order history and order details.</p>
        </div>

        <span className="order-count">
          {orders.length} {orders.length === 1 ? "Order" : "Orders"}
        </span>
      </div>

      {message && <div className="orders-message">{message}</div>}

      {orders.length === 0 && !message ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">📦</div>
          <h2>No orders found</h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <h2>Order #{order.id}</h2>
                  <p className="order-date">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <hr />

              <div className="order-items">
                <h3>Order Items</h3>

                {order.items.map((item, index) => (
                  <div className="order-item" key={index}>
                    <div className="order-item-icon">🛍️</div>
                    <div className="order-item-details">
                      <h4>Product #{item.productId}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Unit Price: ₹{item.unitPrice}</p>
                    </div>
                    <div className="order-item-total">
                      ₹{item.unitPrice * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <span>Total Amount</span>
                <strong>₹{order.totalAmount}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
