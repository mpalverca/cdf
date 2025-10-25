import {

  Typography,
  Box,

} from "@mui/material";
export const Title = () =>{
    return (
         <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 0.5,
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
    )
}

export default  Title 