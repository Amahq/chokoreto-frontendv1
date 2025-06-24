import React from "react";

interface Props {
  name: string;
  setName: (value: string) => void;
  yieldValue: string;
  setYield: (value: string) => void;
  procedure: string;
  setProcedure: (value: string) => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
}

export default function RecipeHeaderEditor({
  name,
  setName,
  yieldValue,
  setYield,
  procedure,
  setProcedure,
  imageUrl,
  setImageUrl
}: Props) {
  return (
    <div className="space-y-2 mb-4">
      <input
        className="w-full border rounded px-3 py-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la receta"
      />
      <input
        type="number"
        className="w-full border rounded px-3 py-1"
        value={yieldValue}
        onChange={(e) => setYield(e.target.value)}
        placeholder="Rinde"
      />
      <textarea
        className="w-full border rounded px-3 py-1"
        rows={4}
        value={procedure}
        onChange={(e) => setProcedure(e.target.value)}
        placeholder="Procedimiento"
      />
      <input
        className="w-full border rounded px-3 py-1"
        placeholder="URL de imagen"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
    </div>
  );
}