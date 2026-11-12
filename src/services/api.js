const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7000/api";

export const API = {
  auth: `${API_BASE_URL}/Auth`,
  products: `${API_BASE_URL}/Product`,
  inventory: `${API_BASE_URL}/Inventory`,
  orders: `${API_BASE_URL}/Order`,
  payments: `${API_BASE_URL}/Payment`,
};

export default API;
