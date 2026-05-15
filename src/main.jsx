import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import "react-toastify/dist/ReactToastify.css";
import "./styles/theme.css";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
    <ThemeProvider>
  <GoogleOAuthProvider clientId="1010691564761-5g594a9l4ds68o3ddbnnp78t9sst641o.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
      <ToastContainer
  position="top-right"
  autoClose={2500}
  theme="dark"
/>
    </BrowserRouter>
  </GoogleOAuthProvider>
  </ThemeProvider>,
);
