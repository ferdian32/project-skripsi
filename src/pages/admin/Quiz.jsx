import { useContext, useEffect, useState } from "react";
import { tableHeadQuiz } from "../../utils/TableQuiz";
import ModalAddDataQuiz from "./CRUD/AddDataQuiz";
import { GlobalProvider } from "../../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const QuizDashboard = () => {
  const [quizData, setQuizData] = useState([]);

  const { setActiveCloseIcon } = useContext(GlobalProvider);
  const navigate = useNavigate();
  const getDataQuiz = async () => {
    try {
      const response = await fetch("http://localhost:3000/quiz");
      const results = await response.json();

      if (!response.ok) {
        console.log("Something went wrong");
        return;
      }

      // Sesuaikan dengan struktur response API
      setQuizData(results.data ?? results);
    } catch (error) {
      console.error("Gagal mendapatkan data quiz", error);
    }
  };
  const deleteDataQuiz = async (id_quiz) => {
    try {
      const response = await fetch(`http://localhost:3000/quiz/${id_quiz}`, {
        method: "DELETE",
      });
      const results = await response.json();
      if (!results) {
        console.log("gagal pada saat menghapus data quiz");
      }
      Swal.fire({
        title: "Congratulation",
        text: "Data berhasil dihapus",
        icon: "success",
      }).then((results) => {
        if (results.isConfirmed) {
          window.location.href = "/dashboard/quiz";
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDataQuiz();
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
      <ModalAddDataQuiz></ModalAddDataQuiz>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {tableHeadQuiz.map((item, index) => {
                return (
                  <th className="border-b px-4 py-3" key={index}>
                    {item}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {quizData.length > 0 ? (
              quizData.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50">
                  <td className=" px-4 py-3">{quiz.id}</td>

                  <td className=" px-4 py-3">{quiz.question}</td>

                  <td className=" px-4 py-3">
                    {quiz.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${quiz.image}`}
                        alt={quiz.question}
                        className="h-16 w-20 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada gambar</span>
                    )}
                  </td>

                  <td className=" px-4 py-3">{quiz.answer}</td>

                  <td className=" px-4 py-3">{quiz.fact || "-"}</td>

                  <td className=" px-4 py-3">
                    {quiz.option?.length > 0 ? (
                      <ul className="list-inside list-disc">
                        {quiz.option.map((item) => (
                          <li key={item.id_option}>{item.option_text}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">Belum ada pilihan</span>
                    )}
                  </td>
                  <td className="grid grid-cols-2 gap-x-3 place-items-center py-4  px-4">
                    <button
                      className="bg-yellow-400 text-slate-50 py-2 px-4"
                      onClick={() =>
                        navigate(`/dashboard/quiz/${quiz.id_quiz}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-slate-50 py-2 px-4"
                      onClick={() => deleteDataQuiz(quiz.id_quiz)}
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

export default QuizDashboard;
