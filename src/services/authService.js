const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7000";
const API_URL = `${BASE_URL}/api/Auth`;

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return await response.json();
};
