// src/pages/Auth/LoginPage.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockLogin } from "../../utils/auth";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // const data = mockLogin(form);
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} margin="normal" />
          <TextField fullWidth type="password" label="Password" name="password" value={form.password} onChange={handleChange} margin="normal" />
          {error && <Typography color="error">{error}</Typography>}
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
