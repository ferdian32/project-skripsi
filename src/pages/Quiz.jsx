import { useState, useEffect } from "react";

export default function AnimalQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mengambil data kuis dari API
  useEffect(() => {
    const getAllDataAnimal = async () => {
      try {
        const response = await fetch("http://localhost:3000/quiz");

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const results = await response.json();
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="mb-4 animate-bounce text-6xl">🐼</div>
          <p className="font-bold text-green-800">Sedang memuat kuis...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 p-6">
        <p className="text-center text-red-600">Gagal memuat kuis: {error}</p>
      </div>
    );
  }

  // Data kosong
  if (quizData.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        Data kuis belum tersedia.
      </div>
    );
  }

  const question = quizData[currentQuestion];
  const options = Array.isArray(question.options) ? question.options : [];

  // Mengambil teks jawaban
  const getOptionText = (option) => {
    return typeof option === "string" ? option : option.option_text;
  };

  // Normalisasi jawaban
  const normalizeAnswer = (answer) => {
    return String(answer ?? "")
      .trim()
      .toLowerCase();
  };

  // Memeriksa jawaban
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
  }

  // Pertanyaan berikutnya
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

  // Halaman hasil akhir
  if (finished) {
    const perfectScore = score === quizData.length * 10;
    const correctCount = score / 10;
    const wrongCount = quizData.length - correctCount;

    return (
      <div className="quiz-page flex min-h-screen items-center justify-center bg-green-50 p-6">
        <div
          className={`result-card w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl ${
            perfectScore ? "result-success" : "result-failed"
          }`}
        >
          {/* Animasi Karakter */}
          <div
            className={`result-emoji mb-5 text-8xl ${
              perfectScore ? "happy-animation" : "sad-animation"
            }`}
          >
            {perfectScore ? "🐼🥳" : "🐼😭"}
          </div>

          {/* Judul Hasil */}
          <h1
            className={`mb-3 text-3xl font-extrabold ${
              perfectScore ? "text-green-700" : "text-red-600"
            }`}
          >
            {perfectScore ? "LUAR BIASA!" : "YAHH, BELUM BERHASIL!"}
          </h1>

          <p className="text-gray-500">
            {perfectScore
              ? "Kamu berhasil menjawab semua pertanyaan dengan benar!"
              : "Jangan sedih, masih ada kesempatan untuk mencoba lagi!"}
          </p>

          {/* Skor */}
          <div
            className={`my-7 rounded-2xl p-6 score-animation ${
              perfectScore ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <p className="text-sm font-bold text-gray-500">SKOR AKHIR KAMU</p>

            <p
              className={`my-3 text-6xl font-extrabold ${
                perfectScore ? "text-green-700" : "text-red-600"
              }`}
            >
              {score}
            </p>

            <p className="text-sm text-gray-500">
              Dari {quizData.length * 10} poin
            </p>

            {/* Jumlah Jawaban */}
            <div className="mt-6 flex justify-center gap-10">
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {correctCount}
                </p>
                <p className="text-sm text-gray-500">Jawaban Benar</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-red-500">{wrongCount}</p>
                <p className="text-sm text-gray-500">Jawaban Salah</p>
              </div>
            </div>
          </div>

          {/* Pesan Motivasi */}
          <div
            className={`mb-6 rounded-xl p-4 ${
              perfectScore ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p
              className={`font-semibold ${
                perfectScore ? "text-green-800" : "text-red-700"
              }`}
            >
              {perfectScore
                ? "🎉 Hebat! Kamu adalah ahli pengenalan hewan!"
                : "🥺 Jangan menyerah! Yuk, belajar lagi dan coba sekali lagi!"}
            </p>
          </div>

          {/* Tombol Main Lagi */}
          <button
            onClick={handleRestart}
            className="w-full rounded-xl bg-amber-400 px-6 py-4 font-bold text-white transition duration-300 hover:scale-105 hover:bg-amber-500 active:scale-95"
          >
            🔄 Main Lagi
          </button>
        </div>
      </div>
    );
  }

  const correct =
    selectedAnswer !== null ? isCorrectAnswer(selectedAnswer) : false;

  return (
    <div className="quiz-page min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <p className="font-semibold text-green-800">
            🐾 Kuis Pengenalan Hewan
          </p>

          <p className="rounded-full bg-amber-100 px-4 py-2 font-bold">
            ⭐ {score}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-5 h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{
              width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
            }}
          />
        </div>

        <p className="mb-4 text-center text-sm text-gray-500">
          Pertanyaan {currentQuestion + 1} dari {quizData.length}
        </p>

        {/* Pertanyaan */}
        <div key={currentQuestion} className="fade-animation">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            {question.question}
          </h2>

          {/* Gambar Hewan */}
          {question.image && (
            <img
              src={`http://localhost:3000/uploads/${question.image}`}
              alt="Gambar hewan untuk kuis"
              className="mx-auto mb-6 h-56 w-full rounded-2xl object-contain"
            />
          )}

          {/* Pilihan Jawaban */}
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
                    style = "border-green-500 bg-green-100 text-green-800";
                  } else if (isSelected) {
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
                    className={`rounded-xl border-2 p-4 font-semibold transition duration-300 hover:scale-[1.02] disabled:cursor-not-allowed ${style}`}
                  >
                    {isSelected && !isCorrect && "❌ "}
                    {isCorrect && selectedAnswer !== null && "✅ "}
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
        </div>

        {/* ANIMASI FEEDBACK */}
        {selectedAnswer !== null && (
          <div
            key={String(correct)}
            className={`relative mt-7 overflow-hidden rounded-2xl border-2 p-5 text-center fade-animation ${
              correct
                ? "border-green-300 bg-green-50"
                : "border-red-300 bg-red-50"
            }`}
          >
            {/* Efek Confetti */}
            {correct && (
              <div className="pointer-events-none absolute inset-0 flex justify-around">
                {["🎉", "✨", "⭐", "🎊", "🌟"].map((emoji, i) => (
                  <span
                    key={i}
                    className="confetti-animation text-2xl"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}

            {/* Emote Karakter */}
            <div
              className={`relative z-10 mb-3 text-7xl ${
                correct ? "happy-animation" : "sad-animation"
              }`}
            >
              {correct ? "🐼🥳" : "🐼😢"}
            </div>

            {/* Pesan */}
            <h3
              className={`relative z-10 text-xl font-extrabold ${
                correct ? "text-green-700" : "text-red-600"
              }`}
            >
              {correct ? "Yeay! Jawaban Benar! 🎉" : "Yahh, Jawaban Salah! 😭"}
            </h3>

            <p className="relative z-10 mt-2 font-semibold text-gray-700">
              {correct
                ? "+10 Poin! Kamu hebat sekali!"
                : `Jangan sedih! Jawaban yang benar adalah: ${question.answer}`}
            </p>

            {question.fact && (
              <p className="relative z-10 mt-3 text-sm leading-relaxed text-gray-600">
                💡 {question.fact}
              </p>
            )}
          </div>
        )}

        {/* Tombol Berikutnya */}
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null || options.length === 0}
          className="mt-6 w-full rounded-xl bg-amber-400 py-4 font-bold text-white transition duration-300 hover:scale-[1.02] hover:bg-amber-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {currentQuestion === quizData.length - 1
            ? "🏆 Lihat Hasil"
            : "Pertanyaan Berikutnya →"}
        </button>
      </div>
    </div>
  );
}
