import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalProvider } from "../../context/GlobalProvider";
import ModalAddDataSpesies from "./CRUD/AddDataSpesies";
import Swal from "sweetalert2";
import { tableHead } from "../../utils/ListTable";

export default function SpesiesDashboard() {
  const { activeCloseIcon, setActiveCloseIcon } = useContext(GlobalProvider);

  const [spesies, setSpesies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mengambil data spesies
  const getDataSpesies = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/spesies");

      if (!response.ok) {
        throw new Error("Gagal mengambil data spesies.");
      }

      const result = await response.json();

      setSpesies(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error("Error mengambil data spesies:", error);
      Swal.fire("Gagal", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataSpesies();
  }, []);

  // Menghapus data spesies
  const deleteDataSpesies = async (id_spesies) => {
    const confirm = await Swal.fire({
      title: "Hapus data spesies?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/spesies/${id_spesies}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus data spesies.");
      }

      await Swal.fire("Berhasil", "Data spesies berhasil dihapus.", "success");

      await getDataSpesies();
    } catch (error) {
      console.error("Error menghapus spesies:", error);
      Swal.fire("Gagal", error.message, "error");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Spesies</h1>

        <button
          onClick={() => setActiveCloseIcon(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Tambah Spesies
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              {tableHead.map((heading, index) => (
                <th key={index} className="border p-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Memuat data...
                </td>
              </tr>
            ) : spesies.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Belum ada data spesies.
                </td>
              </tr>
            ) : (
              spesies.map((item) => (
                <tr key={item.id_spesies}>
                  <td className="p-3">{item.id_spesies}</td>

                  <td className="p-3">{item.title}</td>

                  <td className="p-3">
                    <p className="max-w-xs whitespace-pre-wrap">
                      {item.konten}
                    </p>
                  </td>

                  <td className="p-3">
                    {item.image && (
                      <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        alt={item.title}
                        className="h-16 w-20 rounded object-cover"
                      />
                    )}
                  </td>

                  <td className="p-3">{item.category}</td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/spesies/${item.id_spesies}`)
                        }
                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteDataSpesies(item.id_spesies)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {activeCloseIcon && <ModalAddDataSpesies onSuccess={getDataSpesies} />}
    </div>
  );
}
