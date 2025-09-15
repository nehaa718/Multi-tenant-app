import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/notes" /> : <Login />} />
        <Route path="/notes" element={user ? <Notes /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/notes" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
