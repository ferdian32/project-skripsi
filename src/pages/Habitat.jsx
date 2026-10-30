import { useState, useEffect } from "react";
import HeaderComponent from "../components/Header";

const HabitatPage = () => {
  const [habitat, setHabitat] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Mengambil data API Habitat
  useEffect(() => {
    const getDataHabitat = async () => {
      try {
        const response = await fetch("http://localhost:3000/habitat");

        if (!response.ok) {
          throw new Error("Gagal mengambil data habitat");
        }

        const results = await response.json();

        setHabitat(results.data || results);
      } catch (error) {
        console.error(error);
      }
    };

    getDataHabitat();
  }, []);

  // Mengambil kategori secara otomatis
  const categories = [
    "Semua",
    ...new Set(
      habitat.map((item) => item.category || item.kategori).filter(Boolean),
    ),
  ];

  // Filter pencarian dan kategori
  const filteredHabitat = habitat.filter((item) => {
    const title = item.title || item.judul || "";
    const category = item.category || item.kategori || "";

    const matchSearch = title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "Semua" || category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <section className="w-full bg-white">
      <HeaderComponent />

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
                  placeholder="Cari habitat..."
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
                  Kategori Habitat
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

          {/* CONTENT HABITAT */}
          <main className="min-w-0 lg:col-span-9">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                Informasi Habitat Hewan
              </h1>

              <span className="text-sm text-gray-500">
                {filteredHabitat.length} Habitat
              </span>
            </div>

            {/* Grid Card */}
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              {filteredHabitat.length > 0 ? (
                filteredHabitat.map((item, index) => (
                  <article
                    key={item.id_habitat || item.id || index}
                    className="min-w-0 overflow-hidden bg-white"
                  >
                    {/* Image */}
                    <div className="h-64 w-full overflow-hidden">
                      <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        alt={item.title || item.judul}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="px-4 py-4">
                      <h2 className="mb-3 wrap-break-words text-xl font-bold leading-snug text-gray-900">
                        {item.title || item.judul}
                      </h2>

                      <p className="mb-3 text-sm text-gray-400">
                        {item.category || item.kategori || "Habitat"}
                      </p>

                      <p className="line-clamp-3 wrap-break-words text-base leading-relaxed text-gray-700">
                        {item.konten || item.description || item.deskripsi}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Informasi habitat tidak ditemukan
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

export default HabitatPage;
