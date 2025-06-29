export const mockLogin = ({ email, password }) => {
  if (email === "user@example.com" && password === "password") {
    return { token: "mock-token", user: { name: "John Doe", email } };
  }
  throw new Error("Invalid credentials");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
