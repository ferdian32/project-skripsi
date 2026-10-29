import { useContext, useEffect, useState } from "react";
import { tableHead } from "../../utils/ListTable";
import ModalAddDataPendidikan from "./CRUD/AddDataPendidikan";
import { GlobalProvider } from "../../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PendidikanDashboard = () => {
  const [pendidikanData, setPendidikanData] = useState([]);

  const { setActiveCloseIcon } = useContext(GlobalProvider);
  const navigate = useNavigate();

  // Mengambil data pendidikan
  const getDataPendidikan = async () => {
    try {
      const response = await fetch("http://localhost:3000/pendidikan");

      const results = await response.json();

      if (!response.ok) {
        throw new Error(results.message || "Gagal mengambil data pendidikan");
      }

      setPendidikanData(results.data ?? results);
    } catch (error) {
      console.error("Gagal mendapatkan data pendidikan:", error);
    }
  };

  // Menghapus data pendidikan
  const deleteDataPendidikan = async (id_pendidikan) => {
    try {
      const confirm = await Swal.fire({
        title: "Apakah kamu yakin?",
        text: "Data pendidikan yang dihapus tidak dapat dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
      });

      if (!confirm.isConfirmed) return;

      const response = await fetch(
        `http://localhost:3000/pendidikan/${id_pendidikan}`,
        {
          method: "DELETE",
        },
      );

      const results = await response.json();

      if (!response.ok) {
        throw new Error(results.message || "Gagal menghapus data pendidikan");
      }

      await Swal.fire({
        title: "Berhasil!",
        text: "Data pendidikan berhasil dihapus",
        icon: "success",
      });

      // Memperbarui tabel tanpa reload halaman
      setPendidikanData((prev) =>
        prev.filter((item) => item.id_pendidikan !== id_pendidikan),
      );
    } catch (error) {
      console.error("Gagal menghapus data pendidikan:", error);

      Swal.fire({
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getDataPendidikan();
  }, []);

  return (
    <section className="p-6 relative">
      <div className="flex items-center justify-between mb-5">
        <h1 className="mb-4 text-lg font-bold">Halaman Data Pendidikan</h1>

        <button
          className="bg-blue-500 text-slate-50 py-4 px-2 rounded-md"
          onClick={() => setActiveCloseIcon(true)}
        >
          Tambah Data
        </button>
      </div>

      <ModalAddDataPendidikan />

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
            {pendidikanData.length > 0 ? (
              pendidikanData.map((pendidikan) => (
                <tr key={pendidikan.id_pendidikan} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{pendidikan.id_pendidikan}</td>

                  <td className="px-4 py-3">{pendidikan.title}</td>
                  <td className="px-4 py-3">{pendidikan.konten}</td>

                  <td className="px-4 py-3">
                    {pendidikan.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${pendidikan.image}`}
                        alt={pendidikan.title}
                        className="h-16 w-20 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada gambar</span>
                    )}
                  </td>

                  <td className="px-4 py-3">{pendidikan.category || "-"}</td>

                  <td className="grid grid-cols-2 gap-x-3 place-items-center py-4 px-4">
                    <button
                      className="bg-yellow-400 text-slate-50 py-2 px-4"
                      onClick={() =>
                        navigate(
                          `/dashboard/pendidikan/${pendidikan.id_pendidikan}`,
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="bg-red-500 text-slate-50 py-2 px-4"
                      onClick={() =>
                        deleteDataPendidikan(pendidikan.id_pendidikan)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Data pendidikan belum tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PendidikanDashboard;
