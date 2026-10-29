
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditDataArticle() {
  const { id_article } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState({
    title: "",
    konten: "",
    category: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mengambil data artikel berdasarkan ID
  useEffect(() => {
    const getDataArticle = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/article/${id_article}`
        );

        if (!response.ok) {
          throw new Error("Data artikel tidak ditemukan");
        }

        const result = await response.json();
        const data = result.data ?? result;

        setArticle({
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
        console.error("Gagal mengambil data artikel:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id_article) {
      getDataArticle();
    }
  }, [id_article]);

  // Mengubah input teks
  const handleChange = (e) => {
    const { name, value } = e.target;

    setArticle((prev) => ({
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

    // Hapus URL preview sebelumnya jika berupa blob
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

      formData.append("title", article.title);
      formData.append("konten", article.konten);
      formData.append("category", article.category);

      // Gambar dikirim hanya jika memilih gambar baru
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        `http://localhost:3000/article/${id_article}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengedit artikel"
        );
      }

      alert("Artikel berhasil diperbarui!");
      navigate("/dashboard/article");
    } catch (error) {
      console.error("Gagal mengedit artikel:", error);
      alert(error.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Memuat data artikel...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-5">
        Edit Artikel
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Judul Artikel
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={article.title}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="konten" className="block mb-1">
            Konten Artikel
          </label>
          <textarea
            id="konten"
            name="konten"
            value={article.konten}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            rows={6}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block mb-1">
            Kategori Artikel
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={article.category}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="image" className="block mb-1">
            Gambar Artikel
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
            <p className="mb-2 font-medium">
              Preview Gambar
            </p>
            <img
              src={previewImage}
              alt="Preview gambar artikel"
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
