import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function MemoryCardGame() {
  const [cards, setCards] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [opened, setOpened] = useState([]);
  const [matched, setMatched] = useState([]);
  const [mismatchCards, setMismatchCards] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [moves, setMoves] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mengambil data hewan dari API
  useEffect(() => {
    const getDataMemoryCard = async () => {
      try {
        const response = await fetch("http://localhost:3000/memory-card");

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const results = await response.json();
        const data = Array.isArray(results) ? results : results.data;

        if (!Array.isArray(data)) {
          throw new Error("Format data API tidak valid.");
        }

        setAnimals(data);
        setCards(createCards(data));
      } catch (error) {
        console.error("Gagal mengambil data hewan:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getDataMemoryCard();
  }, []);

  // Membuat dua kartu untuk setiap hewan
  function createCards(animalData) {
    return [...animalData, ...animalData]
      .map((animal, index) => ({
        ...animal,
        cardId: index,
      }))
      .sort(() => Math.random() - 0.5);
  }

  // Membuka kartu
  function flipCard(card) {
    if (
      opened.includes(card.cardId) ||
      matched.includes(card.id_card) ||
      opened.length === 2
    ) {
      return;
    }

    const newOpened = [...opened, card.cardId];
    setOpened(newOpened);

    if (newOpened.length === 2) {
      setMoves((previous) => previous + 1);

      const firstCard = cards.find((item) => item.cardId === newOpened[0]);

      const secondCard = cards.find((item) => item.cardId === newOpened[1]);

      // Jika pasangan cocok
      if (firstCard.id_card === secondCard.id_card) {
        setFeedback("match");
        setMatched((previous) => [...previous, firstCard.id_card]);
        setOpened([]);

        setTimeout(() => {
          setFeedback("");
        }, 800);
      } else {
        // Jika pasangan tidak cocok
        setFeedback("mismatch");
        setMismatchCards(newOpened);

        setTimeout(() => {
          setOpened([]);
          setMismatchCards([]);
          setFeedback("");
        }, 800);
      }
    }
  }

  // Mengulang permainan
  function restartGame() {
    setCards(createCards(animals));
    setOpened([]);
    setMatched([]);
    setMismatchCards([]);
    setFeedback("");
    setMoves(0);
  }

  // Status permainan
  const finished = animals.length > 0 && matched.length === animals.length;

  // Loading
  if (loading) {
    return (
      <main className="game-container">
        <div className="loading-animation">🐼</div>
        <p>Memuat kartu hewan...</p>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="game-container">
        <p>Gagal memuat kartu: {error}</p>
        <button
          className="restart-button"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </main>
    );
  }

  // Data kosong
  if (animals.length === 0) {
    return (
      <main className="game-container">
        <p>Data hewan belum tersedia.</p>
      </main>
    );
  }

  // Halaman hasil akhir
  if (finished) {
    return (
      <main className="game-container result-page">
        <div className="memory-result-card">
          <div className="memory-result-emoji">🐼🥳</div>

          <h1 className="memory-result-title">LUAR BIASA!</h1>

          <p className="memory-result-description">
            Yeay! Kamu berhasil menemukan semua pasangan hewan!
          </p>

          <div className="memory-result-stats">
            <div className="memory-stat">
              <span className="memory-stat-icon">🐾</span>
              <h2>{matched.length}</h2>
              <p>Pasangan</p>
            </div>

            <div className="memory-stat">
              <span className="memory-stat-icon">🎯</span>
              <h2>{moves}</h2>
              <p>Percobaan</p>
            </div>
          </div>

          <div className="memory-success-message">
            🎉 Hebat! Ingatan kamu luar biasa!
          </div>

          <button className="restart-button" onClick={restartGame}>
            🔄 Main Lagi
          </button>

          <div className="memory-confetti">
            {["🎉", "✨", "⭐", "🎊", "🌟", "🎈"].map((emoji, index) => (
              <span
                key={index}
                style={{
                  left: `${10 + index * 15}%`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Halaman permainan
  return (
    <main className="game-container">
      <h1>🐾 Memory Card Hewan</h1>

      <p className="description">
        Temukan dua kartu dengan gambar hewan yang sama!
      </p>

      <div className="game-info">
        <p>
          Pasangan: {matched.length} / {animals.length}
        </p>

        <p>Percobaan: {moves}</p>
      </div>

      {feedback && (
        <div
          className={`memory-feedback ${
            feedback === "match" ? "feedback-success" : "feedback-failed"
          }`}
        >
          <span className="feedback-emoji">
            {feedback === "match" ? "🐼🥳" : "🐼😢"}
          </span>

          <h2>
            {feedback === "match"
              ? "Yeay! Pasangan Cocok!"
              : "Yahh, Belum Cocok!"}
          </h2>

          <p>
            {feedback === "match"
              ? "Kamu hebat! Satu pasangan berhasil ditemukan!"
              : "Jangan sedih, coba cari pasangan yang sama lagi!"}
          </p>
        </div>
      )}

      <div className="card-grid">
        {cards.map((card) => {
          const isOpen =
            opened.includes(card.cardId) || matched.includes(card.id_card);

          const isMatched = matched.includes(card.id_card);
          const isMismatch = mismatchCards.includes(card.cardId);

          return (
            <button
              key={card.cardId}
              className={`animal-card
                ${isOpen ? "open" : ""}
                ${isMatched ? "matched" : ""}
                ${isMismatch ? "mismatch" : ""}
              `}
              onClick={() => flipCard(card)}
              disabled={
                isMatched || opened.includes(card.cardId) || opened.length === 2
              }
            >
              {isOpen ? (
                <>
                  <span className="animal-emoji">{card.emoji}</span>
                  <span className="animal-name">{card.name}</span>
                </>
              ) : (
                <span className="question-mark">?</span>
              )}
            </button>
          );
        })}
      </div>

      <button className="restart-button" onClick={restartGame}>
        🔄 Ulangi Permainan
      </button>
    </main>
  );
}

// Komponen utama dengan musik latar
export default function MemoryCard() {
  const audioRef = useRef(null);
  const [sound, setSound] = useState(false);

  // Autoplay musik
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.3;
    audio.loop = true;

    audio
      .play()
      .then(() => {
        setSound(true);
      })
      .catch(() => {
        setSound(false);
      });

    return () => {
      audio.pause();
    };
  }, []);

  // Tombol musik ON/OFF
  const toggleSound = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (sound) {
      audio.pause();
      setSound(false);
    } else {
      try {
        await audio.play();
        setSound(true);
      } catch (error) {
        console.error("Musik gagal diputar:", error);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/BunnyHoop.mp3" preload="auto" loop />

      <button
        onClick={toggleSound}
        className="fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-slate-700 text-white shadow-lg transition hover:scale-110"
      >
        {sound ? <Volume2 /> : <VolumeX />}
      </button>

      <MemoryCardGame />
    </>
  );
}
