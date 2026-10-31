
import { useContext, useEffect, useState } from "react";
import ModalAddDataMemoryCard from "./CRUD/AddDataMemoryCard";
import { GlobalProvider } from "../../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MemoryCardDashboard = () => {
  const [memoryCardData, setMemoryCardData] = useState([]);

  const { setActiveCloseIcon } = useContext(GlobalProvider);
  const navigate = useNavigate();

  // Mengambil data Memory Card
  const getDataMemoryCard = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/memory-card"
      );

      const results = await response.json();

      if (!response.ok) {
        console.log("Gagal mendapatkan data Memory Card");
        return;
      }

      setMemoryCardData(results.data ?? results);
    } catch (error) {
      console.error("Gagal mendapatkan data Memory Card:", error);
    }
  };

  // Menghapus data Memory Card
  const deleteDataMemoryCard = async (id_card) => {
    const confirm = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data Memory Card akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/memory-card/${id_card}`,
        {
          method: "DELETE",
        }
      );

      const results = await response.json();

      if (!response.ok) {
        Swal.fire({
          title: "Gagal!",
          text: results.message || "Gagal menghapus data Memory Card",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Berhasil!",
        text: "Data Memory Card berhasil dihapus",
        icon: "success",
      });

      // Refresh data tanpa reload halaman
      getDataMemoryCard();

    } catch (error) {
      console.error("Gagal menghapus data:", error);

      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menghapus data",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getDataMemoryCard();
  }, []);

  return (
    <section className="relative p-6">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="mb-4 text-lg font-bold">
          Halaman Data Memory Card
        </h1>

        <button
          className="rounded-md bg-blue-500 px-4 py-3 text-slate-50 hover:bg-blue-600"
          onClick={() => setActiveCloseIcon(true)}
        >
          Tambah Data
        </button>
      </div>

      {/* Modal Tambah */}
      <ModalAddDataMemoryCard />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">

        <table className="w-full border-collapse text-left text-sm">

          {/* Table Header */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "ID",
                "Nama Hewan",
                "Emoji",
                "Aksi",
              ].map((item, index) => (
                <th
                  className="border-b px-4 py-3"
                  key={index}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {memoryCardData.length > 0 ? (
              memoryCardData.map((card) => (
                <tr
                  key={card.id_card}
                  className="border-b hover:bg-gray-50"
                >

                  {/* ID */}
                  <td className="px-4 py-3">
                    {card.id_card}
                  </td>

                  {/* Nama Hewan */}
                  <td className="px-4 py-3 font-medium">
                    {card.name}
                  </td>

                  {/* Emoji */}
                  <td className="px-4 py-3">
                    <span className="text-3xl">
                      {card.emoji}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">

                      <button
                        className="rounded bg-yellow-400 px-4 py-2 text-white hover:bg-yellow-500"
                        onClick={() =>
                          navigate(
                            `/dashboard/memory-card/${card.id_card}`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        onClick={() =>
                          deleteDataMemoryCard(card.id_card)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            ) : (

              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Data Memory Card belum tersedia
                </td>
              </tr>

            )}

          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MemoryCardDashboard;
