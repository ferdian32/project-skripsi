import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/Header";
import FooterComponent from "../components/Footer";

const API_URL = "http://localhost:3000";

const endpoints = ["spesies", "habitat", "perawatan", "pendidikan", "hobi"];

// Mengubah judul menjadi slug URL
const createSlug = (title) => {
  return title.toLowerCase().trim().replace(/\s+/g, "-");
};

// Mengambil data dari response API
const normalizeData = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.data)) return result.data;
  return [];
};

const SearchPage = () => {
  const { title } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState(
    decodeURIComponent(title || "").replaceAll("-", " "),
  );

  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mengambil seluruh data dari 5 kategori
  useEffect(() => {
    const getAllData = async () => {
      try {
        setLoading(true);
        setError("");

        const requests = endpoints.map(async (endpoint) => {
          const response = await fetch(`${API_URL}/${endpoint}`);

          if (!response.ok) {
            throw new Error(`Gagal mengambil data ${endpoint}`);
          }

          const result = await response.json();

          return normalizeData(result).map((item) => ({
            ...item,
            category: item.category || endpoint,
          }));
        });

        const results = await Promise.all(requests);

        // Menggabungkan seluruh kategori menjadi satu array
        setAllData(results.flat());
      } catch (error) {
        console.error(error);
        setError(error.message || "Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    getAllData();
  }, []);

  // Filter berdasarkan judul, kategori, atau isi materi
  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return [];

    return allData.filter((item) => {
      const title = item.title || "";
      const category = item.category || "";
      const content = item.konten || item.content || "";

      return (
        title.toLowerCase().includes(keyword) ||
        category.toLowerCase().includes(keyword) ||
        content.toLowerCase().includes(keyword)
      );
    });
  }, [search, allData]);

  // Membuka halaman detail materi
  const handleDetail = (item) => {
    navigate(`/detail/${createSlug(item.title)}`);
  };

  return (
    <section className="min-h-screen bg-white">
      <HeaderComponent />

      <main className="mx-auto max-w-7xl px-5 py-10">
        {/* Tombol kembali */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
        >
          ← Kembali
        </button>

        {/* Judul halaman */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Hasil Pencarian</h1>

          <p className="mt-2 text-gray-500">
            Cari informasi seputar spesies, habitat, perawatan, pendidikan, dan
            hobi.
          </p>
        </div>

        {/* Input pencarian */}
        <div className="mb-8">
          <div className="flex items-center rounded-xl border border-gray-300 px-4 shadow-sm transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
            <span className="text-xl text-gray-500">⌕</span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama hewan atau materi..."
              className="w-full px-4 py-4 outline-none"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="px-2 text-gray-400 transition hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Informasi pencarian */}
        {!loading && !error && search.trim() && (
          <p className="mb-6 text-sm text-gray-500">
            Ditemukan {filteredData.length} materi untuk pencarian{" "}
            <span className="font-semibold text-gray-800">"{search}"</span>
          </p>
        )}

        {/* Loading */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Memuat materi...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500">{error}</div>
        ) : !search.trim() ? (
          <div className="py-20 text-center text-gray-400">
            Silakan masukkan kata kunci untuk mencari materi.
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-gray-700">
              Materi tidak ditemukan
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Coba gunakan kata kunci lainnya.
            </p>
          </div>
        ) : (
          /* Daftar hasil pencarian */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((item, index) => (
              <article
                key={item._id || item.id || `${item.title}-${index}`}
                onClick={() => handleDetail(item)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Gambar */}
                <div className="h-56 overflow-hidden bg-gray-100">
                  {item.image ? (
                    <img
                      src={`${API_URL}/uploads/${item.image}`}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                {/* Informasi materi */}
                <div className="p-5">
                  <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium capitalize text-purple-700">
                    {item.category}
                  </span>

                  <h2 className="mt-3 line-clamp-2 text-lg font-bold text-gray-800 transition group-hover:text-purple-700">
                    {item.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                    {item.konten ||
                      item.content ||
                      "Tidak ada deskripsi materi."}
                  </p>

                  <div className="mt-4 text-sm font-semibold text-purple-700">
                    Baca selengkapnya →
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <FooterComponent />
    </section>
  );
};

export default SearchPage;
