import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Checkout.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7000";
const ORDER_API = `${BASE_URL}/api/Order`;

function Checkout() {
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const placeOrder = async () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Create Order
      const orderResponse = await fetch(ORDER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.userId,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.text();
        throw new Error(error || "Failed to create order.");
      }

      const order = await orderResponse.json();

      // Save order information for payment
      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          orderId: order.id,
          totalAmount: totalAmount,
        }),
      );

      // Go to Payment page
      navigate("/payment");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <div>
          <h1>Checkout</h1>
          <p>Review your order before placing it.</p>
        </div>

        <Link to="/cart" className="back-cart">
          ← Back to Cart
        </Link>
      </div>

      <hr />

      {cart.length === 0 ? (
        <div className="empty-checkout">
          <div className="empty-checkout-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>Add some products before proceeding to checkout.</p>

          <Link to="/products" className="shop-button">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="checkout-items">
            <h2>Order Summary</h2>

            {cart.map((item) => (
              <div className="checkout-item" key={item.productId}>
                <div className="checkout-item-icon">🛍️</div>

                <div className="checkout-item-details">
                  <h3>{item.name}</h3>

                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <div className="checkout-item-total">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary">
            <h2>Payment Summary</h2>

            <div className="checkout-summary-row">
              <span>Items</span>

              <span>
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>

            <div className="checkout-summary-row total">
              <span>Total Amount</span>

              <span>₹{totalAmount}</span>
            </div>

            <button
              className="place-order-button"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading ? "Creating Order..." : "Proceed to Payment"}
            </button>

            {message && <p className="error-message">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
