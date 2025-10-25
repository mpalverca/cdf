import React from 'react'
import { Box, Typography, Link, Container } from "@mui/material";
export default function Footer() {
  return (
     <Box
        component="footer"
        sx={{
          py: 1,
          px: 2,
          mt: "auto",
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          color: "white",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body1"
            align="center"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
            }}
          >
            © 2025 | Loja-Ecuador | Millan Paul Alverca Gaona | mpalverca | 0985428903
            {/* <Link
              href="https://www.loja.gob.ec/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                ml: 1,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Visita nuestro sitio web
            </Link> */}
          </Typography>
        </Container>
      </Box>
  )
}
