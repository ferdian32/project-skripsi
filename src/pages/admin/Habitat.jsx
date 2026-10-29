import { useContext, useEffect, useState } from "react";
import { tableHead } from "../../utils/ListTable";
import ModalAddDataHabitat from "./CRUD/AddDataHabitat";
import { GlobalProvider } from "../../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const HabitatDashboard = () => {
  const [habitatData, setHabitatData] = useState([]);

  const { setActiveCloseIcon } = useContext(GlobalProvider);
  const navigate = useNavigate();

  // Mengambil data habitat
  const getDataHabitat = async () => {
    try {
      const response = await fetch("http://localhost:3000/habitat");

      const results = await response.json();

      if (!response.ok) {
        throw new Error(results.message || "Gagal mengambil data habitat");
      }

      setHabitatData(results.data ?? results);
    } catch (error) {
      console.error("Gagal mendapatkan data habitat:", error);
    }
  };

  // Menghapus data habitat
  const deleteDataHabitat = async (id_habitat) => {
    try {
      const confirm = await Swal.fire({
        title: "Apakah kamu yakin?",
        text: "Data habitat yang dihapus tidak dapat dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
      });

      if (!confirm.isConfirmed) return;

      const response = await fetch(
        `http://localhost:3000/habitat/${id_habitat}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus data habitat");
      }

      await Swal.fire({
        title: "Berhasil!",
        text: "Data habitat berhasil dihapus",
        icon: "success",
      });

      // Memperbarui tabel tanpa reload halaman
      setHabitatData((prev) =>
        prev.filter((item) => item.id_habitat !== id_habitat),
      );
    } catch (error) {
      console.error("Gagal menghapus data habitat:", error);

      Swal.fire({
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getDataHabitat();
  }, []);

  return (
    <section className="p-6 relative">
      <div className="flex items-center justify-between mb-5">
        <h1 className="mb-4 text-lg font-bold">Halaman Data Habitat</h1>

        <button
          className="bg-blue-500 text-slate-50 py-4 px-2 rounded-md"
          onClick={() => setActiveCloseIcon(true)}
        >
          Tambah Data
        </button>
      </div>

      <ModalAddDataHabitat />

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {tableHead.map((item, index) => (
                <th className="border-b px-4 py-3" key={index}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {habitatData.length > 0 ? (
              habitatData.map((habitat) => (
                <tr key={habitat.id_habitat} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{habitat.id_habitat}</td>

                  <td className="px-4 py-3">{habitat.title}</td>
                  <td className="px-4 py-3">{habitat.konten}</td>
                  <td className="px-4 py-3">
                    {habitat.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${habitat.image}`}
                        alt={habitat.title}
                        className="h-16 w-20 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada gambar</span>
                    )}
                  </td>

                  <td className="px-4 py-3">{habitat.category || "-"}</td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        className="bg-yellow-400 text-slate-50 py-2 px-4 rounded"
                        onClick={() =>
                          navigate(`/dashboard/habitat/${habitat.id_habitat}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 text-slate-50 py-2 px-4 rounded"
                        onClick={() => deleteDataHabitat(habitat.id_habitat)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Data habitat belum tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HabitatDashboard;
