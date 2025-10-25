import React from "react";
import { Box } from "@mui/material";
import Body from "./body.jsx";
import Title from "../../components/home/title.jsx";
export default function Home() {
  // Datos mejorados con más información
  return (
    <Box sx={{ p: 1, minHeight: "80vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Title />
      {/* Grid de items */}
      <Body />
      {/* Footer informativo */}
    </Box>
  );
}
