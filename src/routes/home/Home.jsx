import React from "react";
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TerrainIcon from "@mui/icons-material/Terrain";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { WarningAmberOutlined } from "@mui/icons-material";
import StoreIcon from '@mui/icons-material/Store';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const subRoutes = ["alertmap", "threatmap", "geologia", "fire_camp", "risk"];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route)
  );

  // Datos mejorados con más información
 ;

  const handleItemClick = (route) => {
    navigate(route);
  };

  if (isAnalisis) {
    return <Outlet />;
  }

  return (
    <Box sx={{ p: 1, minHeight: "80vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: .5,
          }}
        >
         Ciudades del Futuro
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "text.secondary",
            maxWidth: "1200px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
        Una visión distinta hacia una ciudad tecnologica 
        </Typography>
      </Box>

      {/* Grid de items */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
          maxWidth: "1300px",
          mx: "auto",
        }}
      >
      </Box>

      {/* Footer informativo */}
     
    </Box>
  );
}
