import { useContext, useEffect, useState } from "react";
import { tableHead } from "../../utils/ListTable";
import ModalAddDataArticle from "./CRUD/AddDataArticle";
import { GlobalProvider } from "../../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const ArticleDashboard = () => {
  const [articleData, setArticleData] = useState([]);

  const { setActiveCloseIcon } = useContext(GlobalProvider);
  const navigate = useNavigate();
  const getDataArticle = async () => {
    try {
      const response = await fetch("http://localhost:3000/article");
      const results = await response.json();

      if (!response.ok) {
        console.log("Something went wrong");
        return;
      }

      // Sesuaikan dengan struktur response API
      setArticleData(results.data ?? results);
    } catch (error) {
      console.error("Gagal mendapatkan data quiz", error);
    }
  };
  const deleteDataArticle = async (id_article) => {
    try {
      const response = await fetch(
        `http://localhost:3000/article/${id_article}`,
        {
          method: "DELETE",
        },
      );
      const results = await response.json();
      if (!results) {
        console.log("gagal pada saat menghapus data article");
      }
      Swal.fire({
        title: "Congratulation",
        text: "Data berhasil dihapus",
        icon: "success",
      }).then((results) => {
        if (results.isConfirmed) {
          window.location.href = "/dashboard/article";
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDataArticle();
  }, []);

  return (
    <section className="p-6 relative">
      <div className="flex items-center justify-between mb-5 cursor-pointer">
        <h1 className="mb-4 text-lg font-bold">Halaman Data Quiz</h1>
        <button
          className="bg-blue-500 text-slate-50 py-4 px-2 rounded-md"
          onClick={() => setActiveCloseIcon(true)}
        >
          Tambah data
        </button>
      </div>
      <ModalAddDataArticle></ModalAddDataArticle>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {tableHead.map((item, index) => {
                return (
                  <th className="border-b px-4 py-3" key={index}>
                    {item}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {articleData.length > 0 ? (
              articleData.map((article) => (
                <tr key={article.id_article} className="hover:bg-gray-50">
                  <td>{article.id_article}</td>
                  <td className=" px-4 py-3">{article.title}</td>

                  <td className=" px-4 py-4 line-clamp-4">{article.konten}</td>

                  <td className=" px-4 py-3">
                    {article.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${article.image}`}
                        alt={article.title}
                        className="h-16 w-20 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada gambar</span>
                    )}
                  </td>

                  <td className=" px-4 py-3">{article.category}</td>
                  <td className=" gap-x-3 flex flex-col items-center justify-center py-4  px-4">
                    <button
                      className="bg-yellow-400 text-slate-50 py-2  px-4"
                      onClick={() =>
                        navigate(`/dashboard/article/${article.id_article}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-slate-50 py-2 px-4 mt-2 cursor-pointer"
                      onClick={() => deleteDataArticle(article.id_article)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  Data quiz belum tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ArticleDashboard;
