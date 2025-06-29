// src/components/budget/BudgetForm.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { validateBudgetForm } from "../../utils/validation";

const BudgetForm = () => {
  const [form, setForm] = useState({
    amount: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateBudgetForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    alert("Budget Submitted Successfully!");
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" mb={2}>
        Set Your Budget
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            name="amount"
            label="Amount"
            value={form.amount}
            onChange={handleChange}
            type="number"
            fullWidth
          />
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.startDate}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.endDate}
            onChange={handleChange}
            fullWidth
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained">
            Submit Budget
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default BudgetForm;
