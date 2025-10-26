// Body.jsx
import React, { useEffect, useRef, useState } from "react";
import { 
  Box, Card, CardContent, Typography, Button, Chip, Alert,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions 
} from "@mui/material";
import { Add, Close, Navigation } from "@mui/icons-material";

export default function Body() {
  const [userLocation, setUserLocation] = useState(null);
  const [arStarted, setArStarted] = useState(false);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [error, setError] = useState(null);
  const [showObjectsPanel, setShowObjectsPanel] = useState(false);
  const [arObjects, setArObjects] = useState([]);
  const [debugInfo, setDebugInfo] = useState("");
  const sceneRef = useRef(null);

  const objectLocations = [
    {
      id: 1,
      name: "🏢 Torre Futurista",
      description: "Estructura energética con núcleo luminoso",
      coordinates: { latitude: -3.985215, longitude: -79.206958 },
      height: 10,
      type: "tower",
      color: "#00ff88"
    },
    {
      id: 2,
      name: "☀️ Panel Solar",
      description: "Tecnología de energía renovable avanzada",
      coordinates: { latitude: -3.985500, longitude: -79.207200 },
      height: 2,
      type: "solar",
      color: "#2c3e50"
    },
    {
      id: 3,
      name: "🏠 Habitat Futurista",
      description: "Cúpula residencial transparente",
      coordinates: { latitude: -3.985943, longitude: -79.207433 },
      height: 5,
      type: "habitat",
      color: "#3498db"
    }
  ];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000;
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const location = { latitude, longitude, accuracy };
            setUserLocation(location);
            
            const objectsWithDistances = objectLocations.map(obj => ({
              ...obj,
              distance: calculateDistance(latitude, longitude, obj.coordinates.latitude, obj.coordinates.longitude)
            }));
            setArObjects(objectsWithDistances);
            
            resolve(location);
          },
          (error) => {
            setError("No se pudo obtener la ubicación. Asegúrate de permitir el acceso.");
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 15000 }
        );
      } else {
        setError("La geolocalización no es soportada.");
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  const getCameraAccess = async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        setCameraAccess(true);
        setDebugInfo("Cámara accedida correctamente");
        return stream;
      } else {
        throw new Error("Camera not supported");
      }
    } catch (error) {
      setError("No se pudo acceder a la cámara: " + error.message);
      throw error;
    }
  };

  const startARExperience = async () => {
    try {
      setError(null);
      setDebugInfo("Iniciando experiencia AR...");
      await getUserLocation();
      await getCameraAccess();
      setArStarted(true);
      setDebugInfo("AR iniciado - La cámara debería estar activa");
    } catch (error) {
      setArStarted(false);
      setDebugInfo("Error al iniciar AR");
    }
  };

  const stopARExperience = () => {
    setArStarted(false);
    setCameraAccess(false);
    setDebugInfo("AR detenido");
  };

  // Configuración optimizada de A-Frame
  const renderAFrameScene = () => {
    return (
      <a-scene 
        ref={sceneRef}
        embedded
        arjs='sourceType: webcam; sourceWidth: 1280; sourceHeight: 720; displayWidth: 1280; displayHeight: 720; debugUIEnabled: true;'
        vr-mode-ui="enabled: false"
        renderer="antialias: true; alpha: true; precision: medium;"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Marker basado en patrón - MÁS CONFIABLE */}
        <a-marker 
          id="animated-marker" 
          type="pattern" 
          url="https://raw.githubusercontent.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/trex-pattern.json"
          smooth="true"
          smoothCount="10"
          smoothTolerance="0.01"
          smoothThreshold="5"
        >
          {/* Torre Futurista */}
          <a-entity position="0 0.5 0">
            <a-cylinder position="0 1 0" radius="0.3" height="2" color="#00ff88"></a-cylinder>
            <a-sphere position="0 2.2 0" radius="0.4" color="#ff6b6b"></a-sphere>
            <a-light type="point" color="#ff4444" intensity="2" position="0 2.2 0"></a-light>
          </a-entity>
          
          <a-text 
            value="🏢 Torre Futurista" 
            position="0 3 0" 
            align="center" 
            color="white"
            scale="2 2 2"
          ></a-text>
        </a-marker>

        {/* Marker alternativo más simple */}
        <a-marker id="simple-marker" preset="hiro">
          <a-box position="0 0.5 0" rotation="0 45 0" color="#4CC3D9"></a-box>
          <a-sphere position="0 1.25 0" radius="0.5" color="#EF2D5E"></a-sphere>
          <a-text value="☀️ Panel Solar" position="0 2 0" align="center" color="white"></a-text>
        </a-marker>

        {/* Marker tipo kanji */}
        <a-marker id="kanji-marker" type="pattern" url="https://raw.githubusercontent.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/trex-pattern.json">
          <a-cylinder position="0 1 0" radius="0.5" height="2" color="#3498db" opacity="0.7"></a-cylinder>
          <a-text value="🏠 Habitat" position="0 2.5 0" align="center" color="white"></a-text>
        </a-marker>

        {/* Cámara */}
        <a-entity camera></a-entity>
      </a-scene>
    );
  };

  // Versión alternativa SIN marcadores (solo cámara)
  const renderSimpleCameraScene = () => {
    return (
      <a-scene 
        embedded
        stats
        arjs='sourceType: webcam; debugUIEnabled: true; detectionMode: mono;'
        vr-mode-ui="enabled: false"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Solo mostrar la cámara sin marcadores */}
        <a-entity camera></a-entity>
        
        {/* Añadir un objeto simple en posición fija para test */}
        <a-box 
          position="0 0 -3" 
          rotation="0 45 0" 
          color="#4CC3D9"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
        ></a-box>
        
        <a-text 
          value="CÁMARA FUNCIONANDO" 
          position="0 1.5 -3" 
          align="center" 
          color="white"
          scale="2 2 2"
        ></a-text>
      </a-scene>
    );
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3, maxWidth: "1300px", mx: "auto" }}>
      
      {/* Panel de Control */}
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Control AR - Debug</Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {debugInfo && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {debugInfo}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>Estado:</Typography>
            {userLocation && <Chip label="📍 Ubicación OK" color="success" size="small" sx={{ mr: 1 }} />}
            {cameraAccess && <Chip label="📷 Cámara OK" color="success" size="small" />}
            {!userLocation && !cameraAccess && <Chip label="Esperando..." color="default" size="small" />}
          </Box>

          {!arStarted ? (
            <Button variant="contained" onClick={startARExperience} fullWidth sx={{ mb: 1 }} startIcon={<Navigation />}>
              Iniciar AR
            </Button>
          ) : (
            <Button variant="outlined" color="error" onClick={stopARExperience} fullWidth sx={{ mb: 1 }} startIcon={<Close />}>
              Detener AR
            </Button>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Usa los marcadores de prueba para ver los objetos 3D
          </Typography>
        </CardContent>
      </Card>

      {/* Lista de Objetos */}
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Objetos Disponibles</Typography>
          {arObjects.map(obj => (
            <Box key={obj.id} sx={{ mb: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary">{obj.name}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>{obj.description}</Typography>
              {userLocation && (
                <Chip label={`${obj.distance.toFixed(1)} metros`} color="info" size="small" variant="outlined" />
              )}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Vista AR */}
      {arStarted && (
        <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vista AR - {cameraAccess ? "Cámara Activa" : "Esperando Cámara"}
              </Typography>
              
              <Box sx={{ 
                width: '100%', 
                height: '500px', 
                position: 'relative', 
                overflow: 'hidden', 
                border: '2px solid green',
                backgroundColor: 'black'
              }}>
                {renderSimpleCameraScene()}
              </Box>

              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Instrucciones de Prueba:</Typography>
                <Typography variant="body2" color="text.secondary">
                  1. <strong>Permite el acceso a la cámara</strong> cuando el navegador lo solicite<br />
                  2. <strong>Apunta la cámara</strong> a tu entorno<br />
                  3. Deberías ver <strong>un cubo azul giratorio</strong> si la cámara funciona<br />
                  4. Para marcadores, descarga e imprime:{" "}
                  <a 
                    href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}
                  >
                    Marcador HIRO
                  </a>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Botones flotantes */}
      {arStarted && (
        <>
          <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => setShowObjectsPanel(true)}>
            <Add />
          </Fab>
        </>
      )}

      <Dialog open={showObjectsPanel} onClose={() => setShowObjectsPanel(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Información de Objetos</DialogTitle>
        <DialogContent>
          {arObjects.map(obj => (
            <Box key={obj.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" color="primary">{obj.name}</Typography>
              <Typography variant="body2">{obj.description}</Typography>
              {userLocation && <Typography variant="h6" color="primary">📍 {obj.distance.toFixed(1)}m</Typography>}
            </Box>
          ))}
        </DialogContent>
        <DialogActions><Button onClick={() => setShowObjectsPanel(false)}>Cerrar</Button></DialogActions>
      </Dialog>
    </Box>
  );
}