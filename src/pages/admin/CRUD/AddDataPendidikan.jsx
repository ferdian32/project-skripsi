import { useState, useContext } from "react";
import { GlobalProvider } from "../../../context/GlobalProvider";
import Swal from "sweetalert2";
import CloseIcon from "../../../fragments/CloseIcon";

export default function ModalAddDataPendidikan({ onSuccess }) {
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
        "Silakan pilih gambar terlebih dahulu.",
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

      const response = await fetch("http://localhost:3000/pendidikan", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan data pendidikan.");
      }

      await Swal.fire(
        "Berhasil",
        "Data pendidikan berhasil ditambahkan.",
        "success",
      );

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
      console.error("Error tambah pendidikan:", error);

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
          <h2 className="text-xl font-bold">Tambah Data Pendidikan</h2>

          <CloseIcon />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block">Judul Pendidikan</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded border p-2"
              placeholder="Masukkan judul pendidikan"
              required
            />
          </div>

          <div>
            <label className="mb-1 block">Deskripsi / Konten</label>

            <textarea
              name="konten"
              value={formData.konten}
              onChange={handleChange}
              className="w-full rounded border p-2"
              rows={4}
              placeholder="Masukkan konten pendidikan"
              required
            />
          </div>

          <div>
            <label className="mb-1 block">Kategori</label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded border p-2"
              placeholder="Contoh: Pengetahuan Hewan"
              required
            />
          </div>

          <div>
            <label className="mb-1 block">Gambar</label>

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
            {loading ? "Menyimpan..." : "Tambah Pendidikan"}
          </button>
        </form>
      </div>
    </div>
  );
}
