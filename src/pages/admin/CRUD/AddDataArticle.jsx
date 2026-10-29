import { useState, useContext } from "react";
import { GlobalProvider } from "../../../context/GlobalProvider";
import Swal from "sweetalert2";
import CloseIcon from "../../../fragments/CloseIcon";

export default function ModalAddDataArticle({ onSuccess }) {
  const { setActiveCloseIcon, activeCloseIcon } = useContext(GlobalProvider);

  const [formData, setFormData] = useState({
    title: "",
    konten: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      Swal.fire(
        "Perhatian",
        "Silakan pilih gambar artikel terlebih dahulu.",
        "warning",
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("konten", formData.konten);
      data.append("category", formData.category);
      data.append("image", image);

      const response = await fetch("http://localhost:3000/article", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan artikel.");
      }

      await Swal.fire("Berhasil", "Artikel berhasil ditambahkan.", "success");

      setFormData({
        title: "",
        konten: "",
        category: "",
      });

      setImage(null);
      setActiveCloseIcon(false);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error("Error tambah artikel:", error);

      Swal.fire("Gagal", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${activeCloseIcon ? "block" : "hidden"}`}
    >
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Tambah Artikel</h2>

          <CloseIcon />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block">Judul Artikel</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded border p-2"
              placeholder="Masukkan judul artikel"
              required
            />
          </div>

          <div>
            <label className="mb-1 block">Konten Artikel</label>

            <textarea
              name="konten"
              value={formData.konten}
              onChange={handleChange}
              className="w-full rounded border p-2"
              rows={5}
              placeholder="Masukkan isi artikel"
              required
            />
          </div>

          <div>
            <label className="mb-1 block">Kategori Artikel</label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded border p-2"
              placeholder="Contoh: Edukasi, Hewan, Lingkungan"
              required
            />
          </div>

          <div>
            <label className="mb-1 block">Gambar Artikel</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full rounded border p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Tambah Artikel"}
          </button>
        </form>
      </div>
    </div>
  );
}
