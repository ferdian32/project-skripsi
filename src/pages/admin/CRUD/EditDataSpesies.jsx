
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditDataSpesies() {
  const { id_spesies } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    konten: "",
    category: "",
    image: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const getDetailSpesies = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/spesies/${id_spesies}`,
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil detail spesies.");
        }

        const result = await response.json();
        const data = result.data ?? result;

        setFormData({
          title: data.title || "",
          konten: data.konten || "",
          category: data.category || "",
          image: data.image || "",
        });
      } catch (error) {
        console.error("Error mengambil detail spesies:", error);
        Swal.fire("Gagal", error.message, "error");
      } finally {
        setFetching(false);
      }
    };

    getDetailSpesies();
  }, [id_spesies]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("konten", formData.konten);
      data.append("category", formData.category);

      // Gambar lama tetap digunakan jika tidak memilih gambar baru.
      if (newImage) {
        data.append("image", newImage);
      }

      const response = await fetch(
        `http://localhost:3000/spesies/${id_spesies}`,
        {
          method: "PATCH",
          body: data,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal memperbarui data spesies.",
        );
      }

      await Swal.fire(
        "Berhasil",
        "Data spesies berhasil diperbarui.",
        "success",
      );

      navigate("/dashboard/spesies");
    } catch (error) {
      console.error("Error edit spesies:", error);
      Swal.fire("Gagal", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="p-6">Memuat data spesies...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-5 text-2xl font-bold">
        Edit Data Spesies
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <div>
          <label className="mb-1 block">Nama Spesies</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded border p-2"
            placeholder="Masukkan nama spesies"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">
            Deskripsi Spesies
          </label>

          <textarea
            name="konten"
            value={formData.konten}
            onChange={handleChange}
            rows={5}
            className="w-full rounded border p-2"
            placeholder="Masukkan deskripsi spesies"
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
            placeholder="Contoh: Mamalia, Reptil, Burung"
            required
          />
        </div>

        <div>
          <label className="mb-2 block">Gambar saat ini</label>

          {formData.image ? (
            <img
              src={`http://localhost:3000/uploads/${formData.image}`}
              alt={formData.title}
              className="mb-3 h-32 w-40 rounded object-cover"
            />
          ) : (
            <p className="mb-3 text-gray-500">
              Belum ada gambar.
            </p>
          )}

          <label className="mb-1 block">
            Ganti Gambar (opsional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewImage(e.target.files?.[0] || null)
            }
            className="w-full rounded border p-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/spesies")}
            className="rounded bg-gray-500 px-4 py-2 text-white"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
