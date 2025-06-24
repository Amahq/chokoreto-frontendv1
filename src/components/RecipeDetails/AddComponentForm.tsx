import React, { useState, useEffect } from "react";
import type { Material, RecipeRef } from "./types";
import { API_BASE_URL } from "../../lib/config";

interface Props {
  recipeId: number;
  materials: Material[];
  recipes: RecipeRef[];
  onChange: () => void;
}

export default function AddComponentForm({ recipeId, materials, recipes, onChange }: Props) {
  const [componentType, setComponentType] = useState("material");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<number | null>(null);
  const [componentQuantity, setComponentQuantity] = useState("1");

  const [showNewComponentForm, setShowNewComponentForm] = useState(false);
  const [newMaterialUnit, setNewMaterialUnit] = useState("");
  const [newRecipeYield, setNewRecipeYield] = useState("1");
  const [newRecipeProcedure, setNewRecipeProcedure] = useState("");

  useEffect(() => {
    const list = componentType === "material" ? materials : recipes;
    const matches = list.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(matches);
    setShowNewComponentForm(searchTerm.length > 2 && matches.length === 0);
  }, [searchTerm, componentType, materials, recipes]);

  const handleCreateNewComponent = async () => {
    if (!searchTerm || !recipeId) return;
    try {
      const url = componentType === "material"
        ? `${API_BASE_URL}/api/materials`
        : `${API_BASE_URL}/api/recipes`;

      const body = componentType === "material"
        ? { name: searchTerm, unit: newMaterialUnit }
        : { name: searchTerm, procedure: newRecipeProcedure, yield: Number(newRecipeYield) };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.id) {
        setSelectedComponentId(data.id);
        setShowNewComponentForm(false);
        setFilteredOptions([]);
      }
    } catch {
      alert("Error al crear componente nuevo");
    }
  };

  const handleAddComponent = async () => {
    if (!selectedComponentId || !componentQuantity || !recipeId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/components/${recipeId}/components`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component_type: componentType,
          component_id: selectedComponentId,
          quantity: Number(componentQuantity)
        })
      });
      const data = await res.json();
      if (data.success) {
        onChange();
        setSearchTerm("");
        setComponentQuantity("1");
      } else {
        alert("Error: " + data.error);
      }
    } catch {
      alert("Error al agregar componente");
    }
  };

  return (
    <div className="border-t pt-4 mt-6">
      <h3 className="font-semibold mb-2">Agregar componente</h3>
      <div className="mb-2">
        <select
          className="border rounded px-2 py-1"
          value={componentType}
          onChange={(e) => {
            setComponentType(e.target.value);
            setSearchTerm("");
            setSelectedComponentId(null);
            setShowNewComponentForm(false);
            setFilteredOptions([]);
          }}
        >
          <option value="material">Material</option>
          <option value="recipe">Receta</option>
        </select>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSelectedComponentId(null);
        }}
        placeholder="Buscar por nombre"
        className="border px-2 py-1 rounded w-full mb-1"
      />
      {searchTerm && filteredOptions.length > 0 && (
        <ul className="bg-white border rounded shadow max-h-40 overflow-y-auto mb-2">
          {filteredOptions.map((opt) => (
            <li
              key={opt.id}
              className="px-3 py-1 hover:bg-pink-100 cursor-pointer"
              onClick={() => {
                setSearchTerm(opt.name);
                setSelectedComponentId(opt.id);
                setShowNewComponentForm(false);
                setFilteredOptions([]);
              }}
            >
              {opt.name}
            </li>
          ))}
        </ul>
      )}

      {showNewComponentForm && (
        <div className="bg-pink-50 border rounded p-3 mt-2">
          <p className="mb-2 font-medium text-pink-700">
            Crear nuevo {componentType === "material" ? "material" : "receta"} llamado "{searchTerm}"
          </p>
          {componentType === "material" ? (
            <input
              type="text"
              placeholder="Unidad (ej: gramos, ml)"
              value={newMaterialUnit}
              onChange={(e) => setNewMaterialUnit(e.target.value)}
              className="border px-2 py-1 rounded w-full mb-2"
            />
          ) : (
            <>
              <input
                type="number"
                placeholder="Rinde"
                value={newRecipeYield}
                onChange={(e) => setNewRecipeYield(e.target.value)}
                className="border px-2 py-1 rounded w-full mb-2"
              />
              <textarea
                placeholder="Procedimiento"
                value={newRecipeProcedure}
                onChange={(e) => setNewRecipeProcedure(e.target.value)}
                className="border px-2 py-1 rounded w-full mb-2"
                rows={3}
              />
            </>
          )}
          <button
            onClick={handleCreateNewComponent}
            className="bg-pink-400 text-white px-4 py-1 rounded hover:bg-pink-500"
          >
            Crear y seleccionar
          </button>
        </div>
      )}
      <input
        type="number"
        value={componentQuantity}
        onChange={(e) => setComponentQuantity(e.target.value)}
        className="border px-2 py-1 rounded w-full mt-2"
        placeholder="Cantidad"
      />
      <button
        onClick={handleAddComponent}
        className="bg-pink-500 text-white px-4 py-2 rounded mt-3 hover:bg-pink-600"
      >
        Agregar a la receta
      </button>
    </div>
  );
}