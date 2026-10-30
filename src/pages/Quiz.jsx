import { useState, useEffect } from "react";

export default function AnimalQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(quizData);

  // Mengambil data kuis dari API
  useEffect(() => {
    const getAllDataAnimal = async () => {
      try {
        const response = await fetch("http://localhost:3000/quiz");

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const results = await response.json();

        console.log("Hasil API:", results);

        const data = Array.isArray(results) ? results : results.data;

        if (!Array.isArray(data)) {
          throw new Error("Format data API tidak valid.");
        }

        setQuizData(data);
      } catch (err) {
        console.error("Gagal mengambil data kuis:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAllDataAnimal();
  }, []);

  // Loading
  if (loading) {
    return <div className="p-6 text-center">Memuat data kuis...</div>;
  }

  // Error
  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Gagal memuat kuis: {error}
      </div>
    );
  }

  // Data kosong
  if (quizData.length === 0) {
    return <div className="p-6 text-center">Data kuis belum tersedia.</div>;
  }

  const question = quizData[currentQuestion];

  // Memastikan pilihan jawaban berupa array
  const options = Array.isArray(question.options) ? question.options : [];

  // Mengambil teks jawaban dari option
  const getOptionText = (option) => {
    return typeof option === "string" ? option : option.option_text;
  };

  // Menyamakan teks sebelum dibandingkan
  const normalizeAnswer = (answer) => {
    return String(answer ?? "")
      .trim()
      .toLowerCase();
  };

  // Memeriksa apakah jawaban benar
  const isCorrectAnswer = (optionText) => {
    return normalizeAnswer(optionText) === normalizeAnswer(question.answer);
  };

  // Memilih jawaban
  function handleAnswer(optionText) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(optionText);

    if (isCorrectAnswer(optionText)) {
      setScore((prevScore) => prevScore + 10);
    }

    console.log("Jawaban dipilih:", optionText);
    console.log("Jawaban benar:", question.answer);
    console.log("Status benar:", isCorrectAnswer(optionText));
  }

  // Berpindah ke pertanyaan berikutnya
  function handleNext() {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setFinished(true);
    }
  }

  // Mengulang kuis
  function handleRestart() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  }

  // Halaman hasil akhir
  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-green-800">Kuis Selesai! 🎉</h1>

        <p className="mt-4 text-xl">
          Skor kamu: {score} / {quizData.length * 10}
        </p>

        <p className="mt-2">
          {score === quizData.length * 10
            ? "Hebat! Semua jawaban benar!"
            : "Bagus! Terus belajar mengenal hewan, ya!"}
        </p>

        <button
          onClick={handleRestart}
          className="mt-6 rounded-xl bg-amber-400 px-6 py-3 font-bold text-white hover:bg-amber-500"
        >
          Main Lagi
        </button>
      </div>
    );
  }

  // Halaman permainan
  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <p className="font-semibold text-green-800">Kuis Pengenalan Hewan</p>

          <p className="rounded-full bg-amber-100 px-4 py-2 font-bold">
            ⭐ {score}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-5 h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
            }}
          />
        </div>

        <p className="mb-4 text-center text-sm text-gray-500">
          Pertanyaan {currentQuestion + 1} dari {quizData.length}
        </p>

        {/* Pertanyaan */}
        <h2 className="mb-6 text-center text-2xl font-bold">
          {question.question}
        </h2>

        {/* Gambar hewan */}
        {question.image && (
          <img
            src={`http://localhost:3000/uploads/${question.image}`}
            alt="Gambar hewan untuk kuis"
            className="mx-auto mb-6 h-56 w-full rounded-2xl object-contain"
          />
        )}

        {/* Pilihan jawaban */}
        {options.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.map((option, index) => {
              const optionText = getOptionText(option);
              const isSelected = selectedAnswer === optionText;
              const isCorrect = isCorrectAnswer(optionText);

              let style =
                "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50";

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  // Jawaban benar selalu hijau
                  style = "border-green-500 bg-green-100 text-green-800";
                } else if (isSelected) {
                  // Jawaban yang dipilih tetapi salah
                  style = "border-red-500 bg-red-100 text-red-800";
                } else {
                  style = "border-gray-200 bg-gray-50 text-gray-400";
                }
              }

              return (
                <button
                  key={
                    typeof option === "object"
                      ? (option.id_option ?? index)
                      : `${option}-${index}`
                  }
                  onClick={() => handleAnswer(optionText)}
                  disabled={selectedAnswer !== null}
                  className={`rounded-xl border-2 p-4 font-semibold transition ${style}`}
                >
                  {optionText}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-red-500">
            Pilihan jawaban belum tersedia.
          </p>
        )}

        {/* Feedback jawaban */}
        {selectedAnswer !== null && (
          <div className="mt-5 rounded-xl bg-blue-50 p-4">
            <p className="font-bold">
              {isCorrectAnswer(selectedAnswer)
                ? "✅ Jawaban benar! +10 poin"
                : `❌ Belum tepat! Jawaban: ${question.answer}`}
            </p>

            <p className="mt-2 text-sm text-gray-700">{question.fact}</p>
          </div>
        )}

        {/* Tombol berikutnya */}
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null || options.length === 0}
          className="mt-6 w-full rounded-xl bg-amber-400 py-3 font-bold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {currentQuestion === quizData.length - 1
            ? "Lihat Hasil"
            : "Pertanyaan Berikutnya →"}
        </button>
      </div>
    </div>
  );
}
