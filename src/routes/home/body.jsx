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
  const sceneRef = useRef(null);

  // Coordenadas de los objetos (lat, lon) con alturas fijas
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

  // Calcular distancia entre dos coordenadas (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000;
    return distance;
  };

  // Obtener ubicación del usuario
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const location = { 
              latitude, 
              longitude, 
              accuracy 
            };
            setUserLocation(location);
            
            // Calcular distancias a los objetos
            const objectsWithDistances = objectLocations.map(obj => ({
              ...obj,
              distance: calculateDistance(latitude, longitude, obj.coordinates.latitude, obj.coordinates.longitude)
            }));
            setArObjects(objectsWithDistances);
            
            resolve(location);
          },
          (error) => {
            console.error("Error obteniendo ubicación:", error);
            setError("No se pudo obtener la ubicación. Asegúrate de permitir el acceso.");
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
          }
        );
      } else {
        const error = "La geolocalización no es soportada por este navegador.";
        setError(error);
        reject(new Error(error));
      }
    });
  };

  // Solicitar acceso a la cámara
  const getCameraAccess = () => {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        })
        .then((stream) => {
          setCameraAccess(true);
          resolve(stream);
        })
        .catch((error) => {
          console.error("Error accediendo a la cámara:", error);
          setError("No se pudo acceder a la cámara. Asegúrate de permitir el acceso.");
          reject(error);
        });
      } else {
        const error = "El acceso a la cámara no es soportado por este navegador.";
        setError(error);
        reject(new Error(error));
      }
    });
  };

  // Iniciar experiencia AR
  const startARExperience = async () => {
    try {
      setError(null);
      
      await getUserLocation();
      await getCameraAccess();
      
      setArStarted(true);
      
    } catch (error) {
      console.error("Error iniciando AR:", error);
      setArStarted(false);
    }
  };

  // Detener experiencia AR
  const stopARExperience = () => {
    setArStarted(false);
    setCameraAccess(false);
  };

  // Actualizar ubicación
  const updateLocation = () => {
    getUserLocation();
  };

  // Renderizar objetos 3D para A-Frame
  const renderAFrameObjects = () => {
    return arObjects.map(obj => (
      <a-entity 
        key={obj.id}
        gps-entity-place={`latitude: ${obj.coordinates.latitude}; longitude: ${obj.coordinates.longitude};`}
      >
        {/* Torre Futurista */}
        {obj.type === 'tower' && (
          <a-entity>
            <a-cylinder 
              position={`0 ${obj.height/2} 0`}
              radius="1"
              height={obj.height}
              color="#4a4a4a"
            ></a-cylinder>
            <a-cylinder 
              position={`0 ${obj.height/2 + 2} 0`}
              radius="0.3"
              height="4"
              color={obj.color}
            ></a-cylinder>
            <a-sphere 
              position={`0 ${obj.height} 0`}
              radius="0.8"
              color="#ff6b6b"
            ></a-sphere>
            <a-light 
              type="point" 
              color="#ff4444" 
              intensity="1"
              position={`0 ${obj.height} 0`}
            ></a-light>
          </a-entity>
        )}
        
        {/* Panel Solar */}
        {obj.type === 'solar' && (
          <a-entity>
            <a-box 
              position={`0 ${obj.height} 0`}
              width="3"
              height="0.1"
              depth="2"
              color={obj.color}
            ></a-box>
            <a-cylinder 
              position="0 0 0"
              radius="0.3"
              height={obj.height}
              color="#7f8c8d"
            ></a-cylinder>
          </a-entity>
        )}
        
        {/* Habitat Futurista */}
        {obj.type === 'habitat' && (
          <a-entity>
            <a-sphere 
              position={`0 ${obj.height} 0`}
              radius="2"
              color={obj.color}
              opacity="0.7"
            ></a-sphere>
            <a-cylinder 
              position="0 0 0"
              radius="2.2"
              height="0.5"
              color="#95a5a6"
            ></a-cylinder>
          </a-entity>
        )}
        
        {/* Etiqueta de distancia - simplificada */}
        <a-text 
          value={`${obj.name}\n${obj.distance.toFixed(1)}m`}
          position={`0 ${obj.height + 3} 0`}
          align="center"
          color="white"
          scale="2 2 2"
        ></a-text>
      </a-entity>
    ));
  };

  useEffect(() => {
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: 3,
        maxWidth: "1300px",
        mx: "auto",
        position: 'relative',
        minHeight: '80vh'
      }}
    >
      {/* Panel de Control */}
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Control AR - A-Frame GPS
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Tu ubicación:
            </Typography>
            {userLocation ? (
              <Box>
                <Chip 
                  label={`Lat: ${userLocation.latitude.toFixed(6)}`} 
                  color="success" 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  label={`Lon: ${userLocation.longitude.toFixed(6)}`} 
                  color="success" 
                  size="small" 
                  sx={{ mb: 1 }}
                />
                <Chip 
                  label={`Precisión: ${userLocation.accuracy.toFixed(0)}m`} 
                  color="info" 
                  size="small" 
                />
              </Box>
            ) : (
              <Chip 
                label="Esperando ubicación..." 
                color="default" 
                size="small" 
              />
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Estado de la cámara:
            </Typography>
            {cameraAccess ? (
              <Chip 
                label="Cámara activa" 
                color="success" 
                size="small" 
              />
            ) : (
              <Chip 
                label="Cámara no disponible" 
                color="default" 
                size="small" 
              />
            )}
          </Box>

          {!arStarted ? (
            <Button 
              variant="contained" 
              onClick={startARExperience}
              fullWidth
              sx={{ mb: 1 }}
              startIcon={<Navigation />}
            >
              Iniciar Experiencia AR
            </Button>
          ) : (
            <Button 
              variant="outlined" 
              color="error"
              onClick={stopARExperience}
              fullWidth
              sx={{ mb: 1 }}
              startIcon={<Close />}
            >
              Detener AR
            </Button>
          )}

          {arStarted && (
            <Button 
              variant="outlined" 
              onClick={updateLocation}
              fullWidth
              sx={{ mb: 1 }}
            >
              Actualizar Ubicación
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Lista de Objetos */}
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Objetos AR Disponibles
          </Typography>
          
          {arObjects.map(obj => (
            <Box key={obj.id} sx={{ mb: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary">
                {obj.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {obj.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Altura: {obj.height}m
              </Typography>
              {userLocation && (
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={`${obj.distance.toFixed(1)} metros`}
                    color={obj.distance < 100 ? "success" : obj.distance < 500 ? "warning" : "default"}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Vista AR con A-Frame */}
      {arStarted && (
        <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vista AR - Cámara en Tiempo Real
              </Typography>
              
              <Box sx={{ width: '100%', height: '500px', position: 'relative', overflow: 'hidden' }}>
                <a-scene 
                  ref={sceneRef}
                  embedded 
                  arjs="sourceType: webcam; debugUIEnabled: false;"
                  vr-mode-ui="enabled: false"
                  renderer="logarithmicDepthBuffer: true;"
                >
                  {/* Configuración mínima de la escena */}
                  <a-assets>
                    {/* Assets si los necesitas */}
                  </a-assets>

                  {/* Cámara AR */}
                  <a-entity camera></a-entity>
                  
                  {/* Sistema GPS */}
                  <a-entity gps-camera rotation-reader></a-entity>
                  
                  {/* Objetos en ubicaciones GPS */}
                  {renderAFrameObjects()}
                  
                  {/* Luces */}
                  <a-light type="ambient" color="#FFFFFF" intensity="0.6"></a-light>
                  <a-light type="directional" color="#FFFFFF" intensity="0.8" position="1 1 1"></a-light>
                </a-scene>
              </Box>

              <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
                <strong>Instrucciones:</strong> Los objetos están fijos en sus coordenadas GPS. 
                Mueve tu dispositivo para verlos superpuestos en la cámara.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Botón Flotante */}
      {arStarted && (
        <Fab
          color="primary"
          aria-label="objetos"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
          onClick={() => setShowObjectsPanel(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Diálogo de Objetos */}
      <Dialog 
        open={showObjectsPanel} 
        onClose={() => setShowObjectsPanel(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Objetos AR - Distancias</DialogTitle>
        <DialogContent>
          {arObjects.map(obj => (
            <Box key={obj.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" color="primary">
                {obj.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {obj.description}
              </Typography>
              <Typography variant="body2">
                <strong>Coordenadas:</strong> {obj.coordinates.latitude.toFixed(6)}, {obj.coordinates.longitude.toFixed(6)}
              </Typography>
              {userLocation && (
                <Typography variant="h6" color={obj.distance < 100 ? "success.main" : obj.distance < 500 ? "warning.main" : "text.primary"}>
                  📍 {obj.distance.toFixed(1)} metros
                </Typography>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowObjectsPanel(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}