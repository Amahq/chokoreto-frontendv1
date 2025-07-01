import React from "react";

interface Props {
  onDelete: () => void;
  onBack: () => void;
}

export default function RecipeMetaPanel({ onDelete, onBack }: Props) {
  return (
    <div className="mt-6 text-center">
      <button
        onClick={onBack}
        className="text-pink-600 hover:underline font-medium"
      >
        ← Volver
      </button>
      <button
        onClick={onDelete}
        className="w-full mt-4 bg-red-100 text-red-600 border border-red-300 rounded-xl px-4 py-2 hover:bg-red-200 font-semibold text-sm"
      >
        Eliminar receta
      </button>
    </div>
  );
}
