import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/Header";
import FooterComponent from "../components/Footer";

const API_URL = "http://localhost:3000";

const endpoints = ["spesies", "habitat", "perawatan", "pendidikan", "hobi"];

const SearchPage = () => {
  const { title } = useParams();
  const navigate = useNavigate();

  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState(title || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mengambil data dari seluruh kategori
  useEffect(() => {
    const getAnimals = async () => {
      try {
        setLoading(true);
        setError("");

        const requests = endpoints.map(async (endpoint) => {
          try {
            const response = await fetch(`${API_URL}/${endpoint}`);

            if (!response.ok) {
              console.warn(`Endpoint ${endpoint} tidak tersedia`);
              return [];
            }

            const result = await response.json();

            const data = Array.isArray(result) ? result : result.data || [];

            return data.map((item) => ({
              ...item,
              category:
                item.category ||
                (endpoint === "article" ? "Artikel" : endpoint),
            }));
          } catch (error) {
            console.warn(`Gagal mengambil ${endpoint}:`, error);
            return [];
          }
        });

        const results = await Promise.all(requests);

        setAnimals(results.flat());
      } catch (error) {
        console.error(error);
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    getAnimals();
  }, []);

  // Menyesuaikan input ketika URL berubah
  useEffect(() => {
    setSearch(title || "");
  }, [title]);

  // Membuat slug untuk halaman detail
  const createSlug = (title) => {
    return title.toLowerCase().trim().replace(/\s+/g, "-");
  };

  // Fungsi pencarian
  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/search/${encodeURIComponent(search.trim())}`);
  };

  // Filter hasil pencarian
  const filteredAnimals = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return [];

    return animals.filter((animal) => {
      // Mengambil berbagai kemungkinan nama kolom
      const title = String(
        animal.title || animal.judul || animal.nama || "",
      ).toLowerCase();

      const category = String(
        animal.category || animal.kategori || "",
      ).toLowerCase();

      const content = String(
        animal.konten ||
          animal.content ||
          animal.description ||
          animal.deskripsi ||
          "",
      ).toLowerCase();

      return (
        title.includes(keyword) ||
        category.includes(keyword) ||
        content.includes(keyword)
      );
    });
  }, [animals, search]);

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-white">
      <HeaderComponent />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* BAGIAN HASIL PENCARIAN */}
          <section className="min-w-0 lg:col-span-9">
            {/* Judul Pencarian */}
            <h2 className="mb-3 text-lg font-bold text-gray-600 sm:text-xl">
              {search
                ? `Search Results for: ${search}`
                : "Jelajahi Dunia Hewan"}
            </h2>

            {/* Garis Kuning */}
            <div className="mb-5 h-1.5 w-full rounded-sm bg-yellow-400" />

            {/* Loading */}
            {loading && (
              <p className="py-16 text-center text-gray-500">
                Memuat data hewan...
              </p>
            )}

            {/* Error */}
            {error && <p className="py-16 text-center text-red-500">{error}</p>}

            {/* Data Tidak Ditemukan */}
            {!loading && !error && filteredAnimals.length === 0 && (
              <div className="py-20 text-center">
                <div className="mb-4 text-5xl">🔎</div>

                <h3 className="text-xl font-bold text-gray-700">
                  Hewan Tidak Ditemukan
                </h3>

                <p className="mt-3 text-sm text-gray-500">
                  Maaf, materi yang kamu cari belum tersedia. Coba gunakan kata
                  kunci lainnya.
                </p>
              </div>
            )}

            {/* Daftar Hasil Pencarian */}
            {!loading &&
              !error &&
              filteredAnimals.map((animal, index) => (
                <article
                  key={
                    animal.id_spesies ||
                    animal.id_habitat ||
                    animal.id_perawatan ||
                    animal.id_pendidikan ||
                    animal.id_hobi ||
                    `${animal.title}-${index}`
                  }
                  className="flex flex-col gap-5 border-b border-gray-200 px-3 py-5 sm:flex-row sm:gap-5"
                >
                  {/* Gambar Materi */}
                  <div className="h-56 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-56 sm:w-1/2 lg:w-[48%]">
                    {animal.image ? (
                      <img
                        src={`${API_URL}/uploads/${animal.image}`}
                        alt={animal.title}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        Tidak ada gambar
                      </div>
                    )}
                  </div>

                  {/* Informasi Materi */}
                  <div className="min-w-0 flex-1">
                    {/* Judul */}
                    <Link
                      to={`/detail/${createSlug(animal.title)}`}
                      className="text-lg font-bold leading-relaxed text-blue-500 transition hover:text-purple-700 sm:text-xl"
                    >
                      {animal.title}
                    </Link>

                    {/* Kategori */}
                    <p className="mt-2 text-sm text-gray-500">
                      {animal.category}
                    </p>

                    {/* Deskripsi */}
                    <p className="mt-3 line-clamp-3 text-base leading-7 text-gray-800">
                      {animal.konten ||
                        animal.content ||
                        "Tidak ada deskripsi materi."}
                    </p>

                    {/* Tombol Read More */}
                    <Link
                      to={`/detail/${createSlug(animal.title)}`}
                      className="mt-5 inline-block rounded-sm bg-gray-200 px-4 py-3 text-sm font-bold text-amber-500 transition hover:bg-amber-400 hover:text-white"
                    >
                      READ MORE
                    </Link>
                  </div>
                </article>
              ))}
          </section>

          {/* SIDEBAR KANAN */}
          <aside className="space-y-6 lg:col-span-3">
            {/* Widget Pencarian */}
            <div className="overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm">
              {/* Header Ungu */}
              <div className="bg-purple-800 px-5 py-4">
                <h3 className="text-lg font-bold uppercase leading-tight text-white">
                  KETIK YANG INGIN ANDA CARI
                </h3>
              </div>

              {/* Input Pencarian */}
              <div className="p-6">
                <form onSubmit={handleSearch}>
                  <div className="flex items-center rounded-sm border border-gray-300 px-3 transition focus-within:border-purple-600">
                    <span className="text-xl text-gray-600">⌕</span>

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari materi..."
                      className="w-full min-w-0 px-3 py-4 text-sm text-gray-700 outline-none"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="mt-3 w-full rounded-sm bg-purple-700 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800"
                  >
                    CARI
                  </button>
                </form>
              </div>
            </div>

            {/* Widget Informasi */}
            <div className="overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm">
              {/* Header Ungu */}
              <div className="h-8 bg-purple-800" />

              {/* Konten Informasi */}
              <div className="bg-gray-50 px-5 py-10 text-center">
                <div className="mb-4 text-5xl">🐾</div>

                <h4 className="text-lg font-bold text-gray-700">
                  Ensiklopedia Hewan
                </h4>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  Temukan berbagai informasi menarik mengenai spesies hewan,
                  habitat, perawatan, pendidikan, dan kehidupan hewan di seluruh
                  dunia.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <FooterComponent />
    </section>
  );
};

export default SearchPage;
