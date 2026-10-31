
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditDataMemoryCard = () => {
  const { id_card } = useParams();
  const navigate = useNavigate();

  const [memoryCard, setMemoryCard] = useState({
    name: "",
    emoji: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mengambil data Memory Card berdasarkan ID
  useEffect(() => {
    const getDataMemoryCard = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/memory-card/${id_card}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Data Memory Card tidak ditemukan"
          );
        }

        const data = result.data ?? result;

        setMemoryCard({
          name: data.name ?? "",
          emoji: data.emoji ?? "",
        });

      } catch (error) {
        console.error("Gagal mengambil data:", error);

        Swal.fire({
          title: "Gagal!",
          text: error.message,
          icon: "error",
        }).then(() => {
          navigate("/dashboard/memory-card");
        });

      } finally {
        setLoading(false);
      }
    };

    getDataMemoryCard();
  }, [id_card, navigate]);

  // Mengubah input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setMemoryCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mengirim perubahan ke API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:3000/memory-card/${id_card}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memoryCard),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengedit Memory Card"
        );
      }

      await Swal.fire({
        title: "Berhasil!",
        text: "Memory Card berhasil diperbarui",
        icon: "success",
      });

      navigate("/dashboard/memory-card");

    } catch (error) {
      console.error("Gagal mengedit Memory Card:", error);

      Swal.fire({
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan",
        icon: "error",
      });

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="p-6 text-gray-600">
        Memuat data Memory Card...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-6">

      <h1 className="mb-5 text-2xl font-bold">
        Edit Memory Card
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border bg-white p-6 shadow-sm"
      >

        {/* Nama Hewan */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block font-medium"
          >
            Nama Hewan
          </label>

          <input
            type="text"
            id="name"
            name="name"
            value={memoryCard.name}
            onChange={handleChange}
            placeholder="Masukkan nama hewan"
            className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        {/* Emoji Hewan */}
        <div>
          <label
            htmlFor="emoji"
            className="mb-1 block font-medium"
          >
            Emoji Hewan
          </label>

          <input
            type="text"
            id="emoji"
            name="emoji"
            value={memoryCard.emoji}
            onChange={handleChange}
            placeholder="Masukkan emoji hewan"
            className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        {/* Preview */}
        <div className="rounded-lg border bg-gray-50 p-5">
          <p className="mb-3 text-sm font-medium text-gray-600">
            Preview Memory Card
          </p>

          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-7xl">
              {memoryCard.emoji || "🐾"}
            </span>

            <p className="text-lg font-bold text-gray-800">
              {memoryCard.name || "Nama Hewan"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => navigate("/dashboard/memory-card")}
            className="rounded-md bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
          >
            Kembali
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditDataMemoryCard;
