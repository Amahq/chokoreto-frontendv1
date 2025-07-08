import { useEffect, useState } from "react";
import type { Material } from "../entities/material/MaterialModel";
import { materialRepo } from "../entities/material";

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await materialRepo.list();
        setMaterials(data);
      } catch (err) {
        console.error("❌ Error al cargar materiales:", err);
        setError("Error de carga");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { materials, loading, error };
}
