import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Policy from "./pages/Policy";
import Claims from "./pages/Claims";
import Nav from "./components/Nav";

export default function App() {
  const riderId = localStorage.getItem("dash_rider_id");

  return (
    <>
      {riderId && <Nav />}
      <Routes>
        <Route
          path="/"
          element={
            riderId ? <Navigate to="/dashboard" /> : <Navigate to="/register" />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/claims" element={<Claims />} />
      </Routes>
    </>
  );
}
