import { useContext, useState } from "react";
import InputElement from "../../../fragments/InputElement";
import CloseIcon from "../../../fragments/CloseIcon";
import { GlobalProvider } from "../../../context/GlobalProvider";

const ModalAddDataQuiz = () => {
  const { activeCloseIcon } = useContext(GlobalProvider);
    
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    fact: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0] || null);
  };

  const addDataQuiz = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      data.append("question", formData.question);
      data.append("answer", formData.answer);
      data.append("fact", formData.fact);

      if (image) {
        data.append("image", image);
      }

      const response = await fetch("http://localhost:3000/quiz", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan quiz");
      }

      alert("Data quiz berhasil ditambahkan!");

      setFormData({
        question: "",
        answer: "",
        fact: "",
      });

      setImage(null);
      e.target.reset();
    } catch (error) {
      console.error("Gagal menambahkan data quiz:", error);
      alert(error.message || "Terjadi kesalahan saat menyimpan quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`max-w-200 w-full px-4 py-4 shadow-md absolute left-20 bg-blue-50 ${
        activeCloseIcon === false ? "hidden" : "block"
      }`}
    >
      <div className="relative">
        <CloseIcon />

        <h1 className="mb-4 text-xl font-bold">Tambah Data Quiz</h1>

        <form onSubmit={addDataQuiz}>
          <InputElement
            name="question"
            id="question"
            type="text"
            placeholder="Masukkan pertanyaan"
            value={formData.question}
            onChange={handleChange}
            required
          />

          <InputElement
            name="image"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <InputElement
            name="answer"
            id="answer"
            type="text"
            placeholder="Masukkan jawaban"
            value={formData.answer}
            onChange={handleChange}
            required
          />

          <InputElement
            name="fact"
            id="fact"
            type="text"
            placeholder="Masukkan keterangan"
            value={formData.fact}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalAddDataQuiz;
