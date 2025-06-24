import { useState } from "react";
import { Sparkles } from "lucide-react";
import { uploadImage } from "../lib/uploadImage";

export default function CreateRecipe() {
  const [form, setForm] = useState({ name: "", procedure: "", yield: "", image_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://recipes-backend.alejandro-hernandez-00.workers.dev/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          procedure: form.procedure,
          yield: parseFloat(form.yield),
          image_url: form.image_url || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✨ Receta creada con éxito!");
        setForm({ name: "", procedure: "", yield: "", image_url: "" });
        setImageFile(null);
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      setMessage("Error de conexión");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6">
      <header className="flex items-center justify-center mb-6">
        <img src="/capybara-mascot.png" alt="Capibara Chokoreto" className="w-14 h-14 mr-2" />
        <h1 className="text-3xl font-bold text-pink-600">Chokoreto</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-6 max-w-md mx-auto space-y-4"
      >
        <h2 className="text-xl font-semibold text-center mb-2">Crear nueva receta</h2>

        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-pink-300 rounded-xl px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Procedimiento</label>
          <textarea
            name="procedure"
            value={form.procedure}
            onChange={handleChange}
            rows={4}
            className="w-full border border-pink-300 rounded-xl px-3 py-2"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Rendimiento</label>
          <input
            type="number"
            name="yield"
            value={form.yield}
            onChange={handleChange}
            className="w-full border border-pink-300 rounded-xl px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Imagen (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full mb-2"
          />
          {form.image_url && (
            <img src={form.image_url} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-2" />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white rounded-xl px-4 py-2 font-semibold"
        >
          <Sparkles className="w-4 h-4" /> {loading ? "Creando..." : "Crear receta"}
        </button>

        {message && <p className="text-center mt-2 text-sm text-pink-600">{message}</p>}
      </form>
    </div>
  );
}