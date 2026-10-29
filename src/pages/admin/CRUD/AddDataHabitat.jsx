
import { useContext, useState } from "react";
import InputElement from "../../../fragments/InputElement";
import CloseIcon from "../../../fragments/CloseIcon";
import { GlobalProvider } from "../../../context/GlobalProvider";

const ModalAddDataHabitat = () => {
  const { activeCloseIcon } = useContext(GlobalProvider);

  const [formDataHabitat, setFormDataHabitat] = useState({
    title: "",
    konten: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mengubah input teks
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormDataHabitat((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Memilih gambar
  const handleImageChange = (e) => {
    setImage(e.target.files?.[0] || null);
  };

  // Menambahkan data habitat
  const addDataHabitat = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formDataHabitat.title);
      data.append("konten", formDataHabitat.konten);
      data.append("category", formDataHabitat.category);

      if (image) {
        data.append("image", image);
      }

      const response = await fetch(
        "http://localhost:3000/habitat",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menambahkan data habitat"
        );
      }

      alert("Data habitat berhasil ditambahkan!");

      setFormDataHabitat({
        title: "",
        konten: "",
        category: "",
      });

      setImage(null);
      e.target.reset();
    } catch (error) {
      console.error(
        "Gagal menambahkan data habitat:",
        error
      );

      alert(
        error.message ||
          "Terjadi kesalahan saat menyimpan data habitat"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`max-w-200 w-full px-4 py-4 shadow-md absolute left-20 bg-blue-50 ${
        activeCloseIcon === false ? "hidden" : "block"
      }`}
    >
      <div className="relative">
        <CloseIcon />

        <h1 className="mb-4 text-xl font-bold">
          Tambah Data Habitat
        </h1>

        <form onSubmit={addDataHabitat}>
          <InputElement
            name="title"
            id="title"
            type="text"
            placeholder="Masukkan nama habitat"
            value={formDataHabitat.title}
            onChange={handleChange}
            required
          />

          <InputElement
            name="image"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          <InputElement
            name="konten"
            id="konten"
            type="text"
            placeholder="Masukkan deskripsi habitat"
            value={formDataHabitat.konten}
            onChange={handleChange}
            required
          />

          <InputElement
            name="category"
            id="category"
            type="text"
            placeholder="Masukkan kategori habitat"
            value={formDataHabitat.category}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalAddDataHabitat;
