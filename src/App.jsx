import { Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AlbumDetails from "./pages/AlbumDetails";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/albums/:albumId"
        element={
          <ProtectedRoute>
            <AlbumDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
