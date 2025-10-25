import React, { useEffect } from "react";
import { Box,} from "@mui/material";
import Routes from "./routes";
import Footer from "./components/Navbar/footer";

function App() {
  //useEffect
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1 }}>
        <Routes />
      </Box>

     <Footer/>
    </Box>
  );
}

export default App;
