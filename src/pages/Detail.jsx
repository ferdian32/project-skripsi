import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/Header";

const API_URL = "http://localhost:3000";

const DetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/detail/${encodeURIComponent(slug)}`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Data tidak ditemukan");
        }

        setDetail(result.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getDetail();
  }, [slug]);

  return (
    <section className="min-h-screen bg-white">
      <HeaderComponent />

      <main className="mx-auto max-w-7xl px-5 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
        >
          ← Kembali
        </button>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">
          {/* KONTEN UTAMA */}
          <div className="lg:col-span-9">
            {loading ? (
              <p className="py-20 text-center text-gray-500">
                Memuat detail...
              </p>
            ) : error ? (
              <p className="py-20 text-center text-red-500">{error}</p>
            ) : detail ? (
              <article>
                {/* JUDUL */}
                <div className="px-5 py-5 text-center">
                  <h1 className="text-2xl font-bold leading-relaxed text-gray-800 md:text-3xl">
                    {detail.title}
                  </h1>

                  {detail.category && (
                    <p className="mt-3 text-gray-500">{detail.category}</p>
                  )}
                </div>

                {/* GAMBAR */}
                {detail.image && (
                  <img
                    src={`${API_URL}/uploads/${detail.image}`}
                    alt={detail.title}
                    className="mt-8 max-h-162.5 w-full object-cover"
                  />
                )}

                {/* ISI ARTIKEL */}
                <div className="px-2 py-8 md:px-5">
                  <div className="whitespace-pre-line text-base leading-8 text-gray-700">
                    {detail.konten}
                  </div>
                </div>
              </article>
            ) : null}
          </div>

          {/* SIDEBAR KANAN */}
          <aside className="space-y-6 lg:col-span-3">
            {/* SEARCH */}
            <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
              <div className="bg-purple-700 px-5 py-4">
                <h2 className="text-lg font-bold uppercase leading-tight text-white">
                  Ketik yang ingin Anda cari
                </h2>
              </div>

              <div className="p-6">
                <div className="flex items-center rounded-md border border-gray-300 px-3">
                  <span className="text-xl text-gray-500">⌕</span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari artikel..."
                    className="w-full px-3 py-4 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* IKLAN PLACEHOLDER */}
            <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
              <div className="h-8 bg-purple-700" />

              <div className="flex min-h-72 items-center justify-center bg-gray-50 p-5">
                <p className="text-sm text-gray-400">Area Iklan</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
};

export default DetailPage;
