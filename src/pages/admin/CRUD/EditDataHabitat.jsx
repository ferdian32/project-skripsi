
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditDataHabitat() {
  const { id_habitat } = useParams();
  const navigate = useNavigate();

  const [habitat, setHabitat] = useState({
    title: "",
    konten: "",
    category: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mengambil data habitat berdasarkan ID
  useEffect(() => {
    const getDataHabitat = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/habitat/${id_habitat}`
        );

        if (!response.ok) {
          throw new Error("Data habitat tidak ditemukan");
        }

        const result = await response.json();
        const data = result.data ?? result;

        setHabitat({
          title: data.title ?? "",
          konten: data.konten ?? "",
          category: data.category ?? "",
          image: data.image ?? "",
        });

        // Menampilkan gambar lama
        if (data.image) {
          setPreviewImage(
            `http://localhost:3000/uploads/${data.image}`
          );
        }
      } catch (error) {
        console.error("Gagal mengambil data habitat:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id_habitat) {
      getDataHabitat();
    }
  }, [id_habitat]);

  // Mengubah input teks
  const handleChange = (e) => {
    const { name, value } = e.target;

    setHabitat((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Memilih gambar baru
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5 MB!");
      e.target.value = "";
      return;
    }

    if (previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Mengirim perubahan ke API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", habitat.title);
      formData.append("konten", habitat.konten);
      formData.append("category", habitat.category);

      // Gambar dikirim jika pengguna memilih gambar baru
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        `http://localhost:3000/habitat/${id_habitat}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengedit data habitat"
        );
      }

      alert("Data habitat berhasil diperbarui!");
      navigate("/dashboard/habitat");
    } catch (error) {
      console.error("Gagal mengedit data habitat:", error);
      alert(error.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Memuat data habitat...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-5">
        Edit Data Habitat
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Nama Habitat
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={habitat.title}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="konten" className="block mb-1">
            Deskripsi Habitat
          </label>
          <textarea
            id="konten"
            name="konten"
            value={habitat.konten}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            rows={6}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block mb-1">
            Kategori Habitat
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={habitat.category}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="image" className="block mb-1">
            Gambar Habitat
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Pilih gambar baru jika ingin mengganti gambar lama.
            Maksimal 5 MB.
          </p>
        </div>

        {previewImage && (
          <div>
            <p className="mb-2 font-medium">Preview Gambar</p>
            <img
              src={previewImage}
              alt="Preview gambar habitat"
              className="w-48 h-36 object-cover rounded-md border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
