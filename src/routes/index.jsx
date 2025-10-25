import React, { Component } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
//Geojson
import NotFoud from "./NotFoud";
import Home from "./home/Home";
import NavBar from "../components/Navbar/NavBar";

export default class index extends Component {
  render() {
    return (
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              /* <ProtectedRoute>
                <Home />{" "}
              </ProtectedRoute> */
              <Home />
            }
          />
          <Route path="/cdf" element={<Home />} />
          {/* <Route path="/riesgosapp/analisis/*" element={<Analisis />}>
            <Route path="alertmap" element={<Alerts />} />
            <Route path="threatmap" element={<Dangermap />} />
            <Route path="geologia" element={<Geologia />} />
            <Route path="fire_camp" element={<FireCamp />} />
            <Route path="risk" element={<RiesgosPage />} />
          </Route> */}
          <Route path="*" element={<NotFoud />} />

          {/*    //auth*/}
        </Routes>
      </Router>
    );
  }
}
