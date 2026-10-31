
import { useContext, useState } from "react";
import InputElement from "../../../fragments/InputElement";
import CloseIcon from "../../../fragments/CloseIcon";
import { GlobalProvider } from "../../../context/GlobalProvider";
import Swal from "sweetalert2";

const ModalAddDataMemoryCard = () => {
  const { activeCloseIcon, setActiveCloseIcon } =
    useContext(GlobalProvider);

  const [formData, setFormData] = useState({
    name: "",
    emoji: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Tambah data Memory Card
  const addDataMemoryCard = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/memory-card",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menambahkan Memory Card"
        );
      }

      await Swal.fire({
        title: "Berhasil!",
        text: "Data Memory Card berhasil ditambahkan",
        icon: "success",
      });

      setFormData({
        name: "",
        emoji: "",
      });

      setActiveCloseIcon(false);

      // Refresh halaman agar data terbaru muncul
      window.location.reload();

    } catch (error) {
      console.error("Gagal menambahkan Memory Card:", error);

      Swal.fire({
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`absolute left-20 z-50 w-full max-w-200 rounded-lg bg-blue-50 px-4 py-4 shadow-md ${
        activeCloseIcon === false ? "hidden" : "block"
      }`}
    >
      <div className="relative">
        <CloseIcon />

        <h1 className="mb-4 text-xl font-bold">
          Tambah Data Memory Card
        </h1>

        <form onSubmit={addDataMemoryCard}>

          {/* Nama Hewan */}
          <InputElement
            name="name"
            id="name"
            type="text"
            placeholder="Masukkan nama hewan"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Emoji Hewan */}
          <InputElement
            name="emoji"
            id="emoji"
            type="text"
            placeholder="Masukkan emoji hewan (contoh: 🦁)"
            value={formData.emoji}
            onChange={handleChange}
            required
          />

          {/* Preview Emoji */}
          {formData.emoji && (
            <div className="my-4 flex items-center gap-3 rounded-lg bg-white p-4">
              <span className="text-4xl">
                {formData.emoji}
              </span>

              <span className="text-sm text-gray-500">
                Preview kartu hewan
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ModalAddDataMemoryCard;
