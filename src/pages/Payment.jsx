import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Payment.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7000";
const PAYMENT_API = `${BASE_URL}/api/Payment`;

function Payment() {
  const navigate = useNavigate();

  const [pendingOrder] = useState(() => {
    const savedOrder = localStorage.getItem("pendingOrder");
    return savedOrder ? JSON.parse(savedOrder) : null;
  });

  const orderId = pendingOrder?.orderId;
  const totalAmount = pendingOrder?.totalAmount;

  const [payment, setPayment] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!orderId) {
      setMessage("Order information not found.");
    }
  }, [orderId]);

  const processPayment = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(PAYMENT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: Number(totalAmount),
          paymentMethod: "Mock",
        }),
      });

      const raw = await response.text();

      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = raw; // plain text error/success
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string" ? data : data?.message || "Payment failed.",
        );
      }

      if (typeof data === "object" && data !== null) {
        setPayment(data);
      } else {
        setPayment({
          id: "-",
          orderId: orderId,
          amount: Number(totalAmount),
          status: "Paid",
        });
      }

      setMessage("Payment successful!");

      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <h1>Payment</h1>
          <p className="error-message">Order information not found.</p>
          <Link to="/products" className="payment-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-card">
        <div className="payment-header">
          <div className="payment-icon">💳</div>
          <h1>Payment</h1>
          <p>Complete your simulated payment.</p>
        </div>

        <div className="payment-order">
          <div>
            <span>Order ID</span>
            <strong>#{orderId}</strong>
          </div>

          <div>
            <span>Amount</span>
            <strong>₹{payment ? payment.amount : totalAmount}</strong>
          </div>
        </div>

        {!payment && (
          <>
            <div className="payment-method">
              <h3>Payment Method</h3>
              <div className="payment-option">
                <span className="radio-circle">✓</span>
                <div>
                  <strong>Simulated Payment</strong>
                  <p>This is a simulated payment for demonstration.</p>
                </div>
              </div>
            </div>

            <button
              className="pay-button"
              onClick={processPayment}
              disabled={loading}
            >
              {loading ? "Processing Payment..." : "Pay Now"}
            </button>
          </>
        )}

        {payment && (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your payment has been completed successfully.</p>

            <div className="payment-details">
              <p>
                <span>Payment ID</span>
                <strong>#{payment.id}</strong>
              </p>
              <p>
                <span>Order ID</span>
                <strong>#{payment.orderId}</strong>
              </p>
              <p>
                <span>Amount</span>
                <strong>₹{payment.amount}</strong>
              </p>
              <p>
                <span>Status</span>
                <strong>{payment.status}</strong>
              </p>
            </div>

            <p className="redirect-message">Redirecting to your orders...</p>
          </div>
        )}

        {message && !payment && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
}

export default Payment;
