import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalProvider } from "../../context/GlobalProvider";
import ModalAddDataPerawatan from "./CRUD/AddDataPerawatan";
import Swal from "sweetalert2";
import { tableHead } from "../../utils/ListTable";

export default function PerawatanDashboard() {
  const { activeCloseIcon, setActiveCloseIcon } = useContext(GlobalProvider);

  const [perawatan, setPerawatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getDataPerawatan = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/perawatan");
      if (!response.ok) {
        throw new Error("Gagal mengambil data perawatan.");
      }

      const result = await response.json();

      // Mendukung API yang mengembalikan array langsung
      // atau object dengan properti data.
      setPerawatan(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error("Error mengambil data perawatan:", error);
      Swal.fire("Gagal", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataPerawatan();
  }, []);

  const deleteDataPerawatan = async (id_perawatan) => {
    const confirm = await Swal.fire({
      title: "Hapus data perawatan?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/perawatan/${id_perawatan}`,
        { method: "DELETE" },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus data.");
      }

      await Swal.fire("Berhasil", "Data perawatan dihapus.", "success");
      await getDataPerawatan();
    } catch (error) {
      console.error("Error menghapus perawatan:", error);
      Swal.fire("Gagal", error.message, "error");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Perawatan</h1>

        <button
          onClick={() => setActiveCloseIcon(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Tambah Perawatan
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
            ) : perawatan.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Belum ada data perawatan.
                </td>
              </tr>
            ) : (
              perawatan.map((item) => (
                <tr key={item.id_perawatan}>
                  <td className=" p-3">{item.id_perawatan}</td>
                  <td className=" p-3">{item.title}</td>
                  <td className=" p-1 line-clamp-4">
                    <p className="max-w-xs whitespace-pre-wrap">
                      {item.konten}
                    </p>
                  </td>
                  <td className=" p-3">
                    {item.image && (
                      <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        alt={item.title}
                        className="h-16 w-20 rounded object-cover"
                      />
                    )}
                  </td>

                  <td className=" p-3">{item.category}</td>

                  <td className=" p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/perawatan/${item.id_perawatan}`)
                        }
                        className="rounded bg-yellow-500 px-3 py-1 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteDataPerawatan(item.id_perawatan)}
                        className="rounded bg-red-600 px-3 py-1 text-white"
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

      {activeCloseIcon && (
        <ModalAddDataPerawatan onSuccess={getDataPerawatan} />
      )}
    </div>
  );
}
