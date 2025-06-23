// src/pages/Home.tsx
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6 flex flex-col items-center justify-center">
      <img
        src="/capybara-mascot.png"
        alt="Capibara Chokoreto"
        className="w-24 h-24 mb-4"
      />
      <h1 className="text-4xl font-bold text-pink-600 mb-2">Bienvenido a Chokoreto</h1>
      <p className="text-pink-500 mb-6 text-center">
        Gestioná tus recetas de pastelería con amor y ternura.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          to="/recipes"
          className="bg-white text-pink-600 border border-pink-300 rounded-xl px-4 py-2 font-semibold shadow hover:bg-pink-100 text-center"
        >
          Ver recetas
        </Link>
        <Link
          to="/create"
          className="bg-pink-400 hover:bg-pink-500 text-white rounded-xl px-4 py-2 font-semibold flex justify-center items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Crear nueva receta
        </Link>
      </div>
    </div>
  );
}
