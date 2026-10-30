import { useState, useEffect, useContext } from "react";
import HeaderComponent from "../components/Header";
import { GlobalProvider } from "../context/GlobalProvider";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const { article, setArticle } = useContext(GlobalProvider);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    console.log("Pencarian hewan:", search);
  };

  useEffect(() => {
    const getDataArticle = async () => {
      try {
        const response = await fetch("http://localhost:3000/article");

        if (!response.ok) {
          throw new Error("Gagal pada saat mengambil data article");
        }

        const results = await response.json();
        setArticle(results.data);
      } catch (error) {
        console.error(error);
      }
    };

    getDataArticle();
  }, [setArticle]);

  return (
    <section className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <HeaderComponent />

      {/* Hero Section */}
      <div className="relative flex min-h-137.5 md:min-h-150 items-center justify-center overflow-hidden px-4">
        {/* Background Image */}
        <img
          src="/images/forest-home.jpg"
          alt="Hewan di habitat alam"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-6xl text-center">
          <h1 className="mb-8 text-2xl font-normal leading-relaxed text-white sm:text-3xl md:text-4xl">
            Jelajahi Dunia{" "}
            <span className="font-bold">Ensiklopedia Hewan Online</span>{" "}
            Terbesar di Indonesia
          </h1>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-sm bg-white shadow-lg sm:flex-row"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="KETIK ILMU YANG ANDA INGIN CARI"
              className="min-w-0 flex-1 px-4 py-5 text-center text-base font-semibold tracking-wide text-purple-700 outline-none placeholder:text-purple-700 sm:text-xl md:text-2xl"
            />

            <button
              type="submit"
              className="bg-amber-400 px-8 py-5 font-bold text-white transition-colors hover:bg-amber-500"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {/* Article Section */}
      <div className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8 text-center text-2xl font-bold">
          Ilmu Terbaru Hewanpedia
        </h1>

        {/* Card Wrapper */}
        <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {article?.map((item) => (
            <div
              key={item.id_article}
              className="w-full min-w-0 overflow-hidden rounded-lg bg-white shadow-md"
            >
              {/* Image */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={`http://localhost:3000/uploads/${item.image}`}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 p-4">
                <h2 className="wrap-break-words text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-gray-500 italic">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
