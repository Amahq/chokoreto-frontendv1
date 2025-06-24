import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Component } from "./types";
import { API_BASE_URL } from "../../lib/config";
import { toast } from "react-toastify";

interface Props {
  recipeId: number;
  components: Component[];
  onChange: () => void;
}

export default function ComponentList({ recipeId, components, onChange }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newQty, setNewQty] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = (comp: Component) => {
    setEditingId(comp.id);
    setNewQty(comp.quantity);
  };

  const saveEdit = async (comp: Component) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/components/${recipeId}/components/${comp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number(newQty) })
      });
      if (!res.ok) throw new Error("Error al actualizar");
      toast.success("✅ Componente actualizado");
      setEditingId(null);
      onChange();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al guardar los cambios");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (comp: Component) => {
    if (!window.confirm(`¿Eliminar ${comp.name}?`)) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/components/${recipeId}/components/${comp.id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Error al eliminar");
      toast.success("🗑️ Componente eliminado");
      onChange();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al eliminar el componente");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderComponents = (list: Component[]) => {
    return list.map((comp, index) => {
      const isEditing = editingId === comp.id;
      return (
        <li key={`${comp.type}-${index}`} className="mb-2">
          <div className="flex justify-between items-center">
            <div>
              {comp.type === "material" ? (
                <>
                  🧁 <strong>{comp.name}</strong>: {isEditing ? (
                    <input
                      type="number"
                      value={newQty}
                      onChange={(e) => setNewQty(Number(e.target.value))}
                      className="border p-1 w-20 mx-2"
                    />
                  ) : (
                    `${comp.quantity} ${comp.unit}`
                  )}
                </>
              ) : (
                <>
                  📦 <Link to={`/recipes/${comp.id}`} className="text-pink-600 hover:underline font-semibold">
                    {comp.name}
                  </Link> (x{isEditing ? (
                    <input
                      type="number"
                      value={newQty}
                      onChange={(e) => setNewQty(Number(e.target.value))}
                      className="border p-1 w-20 mx-2"
                    />
                  ) : comp.quantity})
                </>
              )}
            </div>
            <div className="text-sm flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => saveEdit(comp)}
                    disabled={isProcessing}
                    className="text-green-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    disabled={isProcessing}
                    className="text-gray-500"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(comp)}
                    disabled={isProcessing}
                    className="text-blue-500 underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(comp)}
                    disabled={isProcessing}
                    className="text-red-500 underline"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
          {comp.type === "recipe" && comp.components?.length > 0 && (
            <ul className="ml-4 mt-1 list-disc text-sm text-pink-700">
              {renderComponents(comp.components)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Componentes</h2>
      <ul className="list-disc ml-4 text-pink-800 mb-6">
        {renderComponents(components)}
      </ul>
    </>
  );
}