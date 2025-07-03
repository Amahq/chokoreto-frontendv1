// src/lib/utils.ts
import { db } from "./db";

/**
 * Formatea una fecha al estilo español corto (ej: 1 jul 2025).
 */
export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Verifica si existen mutaciones locales pendientes de sincronización.
 */
export async function hasPendingMutations(): Promise<boolean> {
  const count = await db.pendingMutations.count();
  return count > 0;
}
