import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../styles/index.css";
import { trySyncPendingMutations } from "./lib/sync";
import { preloadAppData } from "./lib/preload";

// Ejecutar precarga y sincronización
preloadAppData();
window.addEventListener("online", trySyncPendingMutations);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
