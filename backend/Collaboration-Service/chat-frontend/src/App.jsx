import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "./components/Auth";
import Home from "./components/Home";
import { getToken } from "./utils/auth";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!getToken());
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Auth setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Auth setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
