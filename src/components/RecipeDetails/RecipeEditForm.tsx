import React from "react";
import type { RecipeData } from "./types";

interface Props {
  editMode: boolean;
  uploading: boolean;
  recipe: RecipeData;
  editedName: string;
  editedYield: string;
  editedProcedure: string;
  editedImageUrl: string;
  onNameChange: (v: string) => void;
  onYieldChange: (v: string) => void;
  onProcedureChange: (v: string) => void;
  onImageChange: (file: File) => Promise<void>;
  onSave: () => void;
  onCancel: () => void;
}

export default function RecipeEditForm({
  editMode,
  uploading,
  recipe,
  editedName,
  editedYield,
  editedProcedure,
  editedImageUrl,
  onNameChange,
  onYieldChange,
  onProcedureChange,
  onImageChange,
  onSave,
  onCancel,
}: Props) {
  if (!editMode) return <h2 className="text-xl font-semibold mb-4">{recipe.name}</h2>;

  return (
    <>
      <input
        className="w-full border rounded px-3 py-1 mb-2"
        value={editedName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Nombre de la receta"
      />
      <input
        type="number"
        className="w-full border rounded px-3 py-1 mb-2"
        value={editedYield}
        onChange={(e) => onYieldChange(e.target.value)}
        placeholder="Rinde"
      />
      <textarea
        className="w-full border rounded px-3 py-1 mb-2"
        rows={4}
        value={editedProcedure}
        onChange={(e) => onProcedureChange(e.target.value)}
        placeholder="Procedimiento"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageChange(file);
        }}
        className="w-full mb-2"
        disabled={uploading}
      />
      {editedImageUrl && (
        <img
          src={editedImageUrl}
          alt="Preview"
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}
    </>
  );
}
