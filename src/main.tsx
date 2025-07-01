import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../styles/index.css";
import { trySyncPendingMutations } from "./lib/sync";
import { preloadAppData } from "./lib/preload";
import { db } from "./lib/db";

// Precarga de materiales, recetas, precios, etc.
preloadAppData();

// Garantizar sincronización al arrancar
trySyncPendingMutations();

// Reintentar al volver online
window.addEventListener("online", () => {
  console.log("[SYNC] Online: intentando sincronizar...");
  trySyncPendingMutations();
});

// Para debugging en consola: listar mutaciones pendientes
if (import.meta.env.DEV) {
  window.showPending = async () => {
    const pending = await db.pendingMutations.toArray();
    console.log("[DEBUG] Mutaciones pendientes:", pending);
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
