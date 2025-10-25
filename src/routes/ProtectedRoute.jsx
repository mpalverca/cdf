// src/components/ProtectedRoute.js
// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
//import { client } from "../utils/authkey";

export default function ProtectedRoute({ children }) {
  //const user = client.auth.getUser();
  
//  if (!user) {
//    return <Navigate to="/login" replace />;
//  }

  return children;
}