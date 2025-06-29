// src/pages/NotFoundPage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Typography variant="h3">404</Typography>
      <Typography variant="h6" mb={2}>
        Page Not Found
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotFoundPage;
