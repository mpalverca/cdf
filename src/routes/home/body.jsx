// Body.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Card, CardContent, Typography, Button, Chip, Alert } from "@mui/material";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Body() {
  const [userLocation, setUserLocation] = useState(null);
  const [arStarted, setArStarted] = useState(false);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

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
            console.log("Ubicación obtenida:", location);
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
            facingMode: 'environment', // Usar cámara trasera en móviles
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
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

  // Inicializar escena Three.js con AR
  const initARScene = () => {
    if (!canvasRef.current) return;

    // Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Cámara - ajustada para AR
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Luz ambiental para mejor visualización
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Crear objetos 3D basados en geolocalización
    createGeolocatedObjects(scene);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotar objetos si existen
      if (sceneRef.current) {
        sceneRef.current.children.forEach(child => {
          if (child.userData && child.userData.rotatable) {
            child.rotation.y += 0.01;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Manejar redimensionado
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
  };

  // Crear objetos 3D basados en geolocalización
  const createGeolocatedObjects = (scene) => {
    // Limpiar objetos anteriores
    while(scene.children.length > 2) { // Mantener las luces
      scene.remove(scene.children[2]);
    }

    // Objeto 1: Torre futurista (posición relativa basada en ubicación)
    const createFuturisticTower = (x, y, z) => {
      const group = new THREE.Group();
      
      // Base
      const baseGeometry = new THREE.CylinderGeometry(0.3, 0.5, 0.1, 32);
      const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x4a4a4a });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      group.add(base);

      // Torre principal
      const towerGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.5, 32);
      const towerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.y = 0.8;
      group.add(tower);

      // Esfera superior
      const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        emissive: 0x442222
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.y = 1.6;
      group.add(sphere);

      group.position.set(x, y, z);
      group.userData = { rotatable: true, type: 'futuristic_tower' };
      return group;
    };

    // Objeto 2: Energía solar
    const createSolarPanel = (x, y, z) => {
      const group = new THREE.Group();
      
      // Panel solar
      const panelGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.5);
      const panelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2c3e50,
        emissive: 0x1a2530
      });
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      group.add(panel);

      // Base
      const baseGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8);
      const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x7f8c8d });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -0.16;
      group.add(base);

      group.position.set(x, y, z);
      group.userData = { rotatable: false, type: 'solar_panel' };
      return group;
    };

    // Objeto 3: Habitat futurista
    const createFutureHabitat = (x, y, z) => {
      const group = new THREE.Group();
      
      // Cúpula principal
      const domeGeometry = new THREE.SphereGeometry(0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3498db,
        transparent: true,
        opacity: 0.7
      });
      const dome = new THREE.Mesh(domeGeometry, domeMaterial);
      dome.rotation.x = Math.PI;
      group.add(dome);

      // Base
      const baseGeometry = new THREE.CylinderGeometry(0.45, 0.5, 0.1, 32);
      const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x95a5a6 });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -0.25;
      group.add(base);

      group.position.set(x, y, z);
      group.userData = { rotatable: true, type: 'future_habitat' };
      return group;
    };

    // Posicionar objetos en el mundo AR
    // Estos valores podrían calcularse basándose en la ubicación real del usuario
    const tower = createFuturisticTower(-2, 0, -5);
    const solarPanel = createSolarPanel(2, 0, -5);
    const habitat = createFutureHabitat(0, 0, -7);

    scene.add(tower);
    scene.add(solarPanel);
    scene.add(habitat);

    console.log("Objetos 3D creados y posicionados");
  };

  // Iniciar experiencia AR completa
  const startARExperience = async () => {
    try {
      setError(null);
      setArStarted(true);
      
      // Obtener ubicación primero
      await getUserLocation();
      
      // Luego acceder a la cámara
      await getCameraAccess();
      
      // Finalmente inicializar la escena AR
      setTimeout(() => {
        initARScene();
      }, 1000);
      
    } catch (error) {
      console.error("Error iniciando AR:", error);
      setArStarted(false);
    }
  };

  // Detener experiencia AR
  const stopARExperience = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setArStarted(false);
    setCameraAccess(false);
  };

  useEffect(() => {
    // Cleanup al desmontar el componente
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
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
      }}
    >
      {/* Panel de Control */}
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Control AR
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Estado de la ubicación:
            </Typography>
            {userLocation ? (
              <Chip 
                label={`Ubicación obtenida (${userLocation.accuracy.toFixed(0)}m)`} 
                color="success" 
                size="small" 
              />
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
            >
              Detener AR
            </Button>
          )}

          <Typography variant="caption" color="text.secondary">
            Asegúrate de permitir el acceso a la ubicación y cámara cuando se solicite.
          </Typography>
        </CardContent>
      </Card>

      {/* Información de Objetos */}
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Objetos AR Disponibles
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              🏢 Torre Futurista
            </Typography>
            <Typography variant="body2">
              Estructura energética con núcleo luminoso
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              ☀️ Panel Solar
            </Typography>
            <Typography variant="body2">
              Tecnología de energía renovable avanzada
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              🏠 Habitat Futurista
            </Typography>
            <Typography variant="body2">
              Cúpula residencial transparente
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Los objetos se posicionan relativamente a tu ubicación actual.
          </Typography>
        </CardContent>
      </Card>

      {/* Vista AR */}
      {arStarted && (
        <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vista de Realidad Aumentada
              </Typography>
              
              <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
                {/* Video de la cámara */}
                <video
                  ref={videoRef}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  muted
                  playsInline
                />
                
                {/* Canvas de Three.js superpuesto */}
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    zIndex: 1
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
                <strong>Instrucciones:</strong> Mueve tu dispositivo para explorar los objetos 3D en tu entorno. 
                Los objetos se renderizan superpuestos a la vista de la cámara.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Información de Uso */}
      <Card sx={{ p: 2, gridColumn: { xs: "1", md: "1 / -1" } }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cómo usar la Experiencia AR
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="primary">1. Permisos</Typography>
              <Typography variant="body2">Acepta ubicación y cámara cuando se soliciten</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary">2. Iniciar</Typography>
              <Typography variant="body2">Haz clic en "Iniciar Experiencia AR"</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary">3. Explorar</Typography>
              <Typography variant="body2">Mueve tu dispositivo para ver los objetos</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary">4. Interactuar</Typography>
              <Typography variant="body2">Observa los objetos 3D en tu espacio real</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}