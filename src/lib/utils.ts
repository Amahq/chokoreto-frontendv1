// src/lib/utils.ts

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
