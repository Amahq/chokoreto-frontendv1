// src/components/AddPriceForm.tsx

import { useState } from "react";
import { db } from "../lib/db";

export function AddPriceForm() {
  const [materialName, setMaterialName] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialName || amount === "") return;

    const material = await db.materials
      .where("name")
      .equalsIgnoreCase(materialName)
      .first();

    if (!material) {
      alert("Material no encontrado");
      return;
    }

    await db.prices.add({
      id: crypto.randomUUID(),
      material_id: material.id,
      material_name: material.name,
      amount: Number(amount),
      created_at: new Date().toISOString(),
      synced: false,
    });

    setMaterialName("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Nombre del material"
        value={materialName}
        onChange={(e) => setMaterialName(e.target.value)}
        className="p-2 border rounded-md"
      />
      <input
        type="number"
        placeholder="Precio"
        value={amount}
        onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
        className="p-2 border rounded-md"
      />
      <button
        type="submit"
        className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
      >
        Agregar precio
      </button>
    </form>
  );
}
