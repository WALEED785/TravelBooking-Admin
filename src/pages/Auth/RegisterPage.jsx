// src/pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ name: form.name, email: form.email }));
    navigate("/login");
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" fullWidth name="name" value={form.name} onChange={handleChange} margin="normal" />
          <TextField label="Email" fullWidth name="email" value={form.email} onChange={handleChange} margin="normal" />
          <TextField type="password" label="Password" fullWidth name="password" value={form.password} onChange={handleChange} margin="normal" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
