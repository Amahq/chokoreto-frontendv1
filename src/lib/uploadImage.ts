// src/lib/uploadImage.ts

export async function uploadImage(file: File): Promise<string> {
  const CLOUD_NAME = "dtaewxpxq";
  const UPLOAD_PRESET = "chokoreto_unsigned"; // ⚠️ Reemplazá con tu preset creado

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("Error al subir la imagen");
  }

  const data = await res.json();
  return data.secure_url; // ✅ Esta es la URL que podés guardar como image_url
}
