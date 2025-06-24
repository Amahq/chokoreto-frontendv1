// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, List, PlusCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white shadow-md flex justify-around py-3 border-t border-pink-200">
      <Link
        to="/"
        className={`flex flex-col items-center text-sm ${isActive("/") ? "text-pink-600 font-bold" : "text-pink-400"}`}
      >
        <HomeIcon className="w-5 h-5 mb-1" />
        Inicio
      </Link>

      <Link
        to="/recipes"
        className={`flex flex-col items-center text-sm ${isActive("/recipes") ? "text-pink-600 font-bold" : "text-pink-400"}`}
      >
        <List className="w-5 h-5 mb-1" />
        Recetas
      </Link>

      <Link
        to="/create"
        className={`flex flex-col items-center text-sm ${isActive("/create") ? "text-pink-600 font-bold" : "text-pink-400"}`}
      >
        <PlusCircle className="w-5 h-5 mb-1" />
        Crear
      </Link>

      <Link
        to="/materials"
        className={`flex flex-col items-center text-sm ${isActive("/materials") ? "text-pink-600 font-bold" : "text-pink-400"}`}
      >
        🧂
        <span className="text-xs mt-1">Materiales</span>
      </Link>
    </nav>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <div className="pb-16">
        <Router />
        <Navigation />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}