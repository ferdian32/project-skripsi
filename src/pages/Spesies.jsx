import { useState, useEffect } from "react";
import HeaderComponent from "../components/Header";

const SpesiesPage = () => {
  const [spesies, setSpesies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Mengambil data API
  useEffect(() => {
    const getDataSpesies = async () => {
      try {
        const response = await fetch("http://localhost:3000/spesies");

        if (!response.ok) {
          throw new Error("Gagal mengambil data spesies");
        }

        const results = await response.json();

        setSpesies(results.data || results);
      } catch (error) {
        console.error(error);
      }
    };

    getDataSpesies();
  }, []);

  // Mengambil kategori secara otomatis
  const categories = [
    "Semua",
    ...new Set(
      spesies.map((item) => item.category || item.kategori).filter(Boolean),
    ),
  ];

  // Filter pencarian dan kategori
  const filteredSpesies = spesies.filter((item) => {
    const title = item.title || item.nama_spesies || "";
    const category = item.category || item.kategori || "";

    const matchSearch = title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "Semua" || category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <section className="w-full bg-white">
      <HeaderComponent></HeaderComponent>
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* SIDEBAR */}
          <aside className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6 overflow-hidden rounded-md border border-gray-200 shadow-sm">
              <div className="bg-purple-800 px-5 py-4">
                <h2 className="text-lg font-bold uppercase text-white">
                  Ketik Yang Ingin Anda Cari
                </h2>
              </div>

              <div className="p-6">
                <input
                  type="text"
                  placeholder="Cari spesies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-4 text-sm outline-none transition focus:border-purple-700 focus:ring-1 focus:ring-purple-700"
                />
              </div>
            </div>

            {/* Category */}
            <div className="overflow-hidden rounded-md border border-gray-200 shadow-sm">
              <div className="bg-purple-800 px-5 py-4">
                <h2 className="text-lg font-bold uppercase text-white">
                  Kategori Spesies
                </h2>
              </div>

              <div className="p-4">
                <div className="flex flex-col">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCategory(category)}
                      className={`border-b border-gray-100 px-3 py-3 text-left text-sm transition hover:bg-purple-50 hover:text-purple-700 ${
                        selectedCategory === category
                          ? "font-bold text-purple-800"
                          : "text-gray-600"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* CONTENT SPESIES */}
          <main className="min-w-0 lg:col-span-9">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                Daftar Spesies
              </h1>

              <span className="text-sm text-gray-500">
                {filteredSpesies.length} Spesies
              </span>
            </div>

            {/* Grid Card */}
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              {filteredSpesies.length > 0 ? (
                filteredSpesies.map((item, index) => (
                  <article
                    key={item.id_spesies || item.id || index}
                    className="min-w-0 overflow-hidden bg-white"
                  >
                    {/* Image */}
                    <div className="h-64 w-full overflow-hidden">
                      <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        alt={item.title || item.nama_spesies}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="px-4 py-4">
                      <h2 className="mb-3 wrap-break-words text-xl font-bold leading-snug text-gray-900">
                        {item.title || item.nama_spesies}
                      </h2>

                      <p className="mb-3 text-sm text-gray-400">
                        {item.category || item.kategori || "Spesies"}
                      </p>

                      <p className="line-clamp-3 wrap-break-words text-base leading-relaxed text-gray-700">
                        {item.description || item.konten || item.deskripsi}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Spesies tidak ditemukan
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    Coba gunakan kata kunci atau kategori lainnya.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default SpesiesPage;
