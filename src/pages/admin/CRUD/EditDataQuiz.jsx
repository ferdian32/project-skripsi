import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditDataQuiz() {
  const { id_quiz } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    question: "",
    answer: "",
    fact: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mengambil data quiz berdasarkan ID
  useEffect(() => {
    const getDataQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:3000/quiz/${id_quiz}`);

        if (!response.ok) {
          throw new Error("Data quiz tidak ditemukan");
        }

        const result = await response.json();
        const data = result.data ?? result;

        setQuiz({
          question: data.question ?? "",
          answer: data.answer ?? "",
          fact: data.fact ?? "",
          image: data.image ?? "",
        });

        // Menampilkan gambar lama
        if (data.image) {
          setPreviewImage(`http://localhost:3000/uploads/${data.image}`);
        }
      } catch (error) {
        console.error("Gagal mengambil data quiz:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    getDataQuiz();
  }, [id_quiz]);

  // Mengubah input teks
  const handleChange = (e) => {
    const { name, value } = e.target;

    setQuiz((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Memilih gambar baru
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      e.target.value = "";
      return;
    }

    // Validasi ukuran maksimal 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5 MB!");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    // Preview gambar baru
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  // Mengirim perubahan ke API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("question", quiz.question);
      formData.append("answer", quiz.answer);
      formData.append("fact", quiz.fact);

      // Gambar hanya dikirim jika user memilih gambar baru
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(`http://localhost:3000/quiz/${id_quiz}`, {
        method: "PATCH",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengedit quiz");
      }

      alert("Quiz berhasil diperbarui!");
      navigate("/dashboard/quiz");
    } catch (error) {
      console.error("Gagal mengedit quiz:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Memuat data quiz...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-5">Edit Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block mb-1">
            Pertanyaan
          </label>
          <input
            id="question"
            name="question"
            value={quiz.question}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="answer" className="block mb-1">
            Jawaban
          </label>
          <input
            id="answer"
            name="answer"
            value={quiz.answer}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="fact" className="block mb-1">
            Keterangan
          </label>
          <textarea
            id="fact"
            name="fact"
            value={quiz.fact}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Input gambar */}
        <div>
          <label htmlFor="image" className="block mb-1">
            Gambar Quiz
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Pilih gambar baru jika ingin mengganti gambar lama. Maksimal 5 MB.
          </p>
        </div>

        {/* Preview gambar */}
        {previewImage && (
          <div>
            <p className="mb-2 font-medium">Preview gambar</p>
            <img
              src={previewImage}
              alt="Preview gambar quiz"
              className="w-48 h-36 object-cover rounded-md border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
