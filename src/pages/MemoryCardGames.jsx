
import { useEffect, useState } from "react";

export default function MemoryCard() {
  const [cards, setCards] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [opened, setOpened] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mengambil data hewan dari API
  useEffect(() => {
    const getDataMemoryCard = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/memory-card"
        );

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const results = await response.json();

        const data = Array.isArray(results)
          ? results
          : results.data;

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

      const firstCard = cards.find(
        (item) => item.cardId === newOpened[0]
      );

      const secondCard = cards.find(
        (item) => item.cardId === newOpened[1]
      );

      // Cocokkan berdasarkan ID hewan
      if (firstCard.id_card === secondCard.id_card) {
        setMatched((previous) => [
          ...previous,
          firstCard.id_card,
        ]);

        setOpened([]);
      } else {
        setTimeout(() => {
          setOpened([]);
        }, 800);
      }
    }
  }

  // Mengulang permainan
  function restartGame() {
    setCards(createCards(animals));
    setOpened([]);
    setMatched([]);
    setMoves(0);
  }

  // Status permainan
  const finished =
    animals.length > 0 &&
    matched.length === animals.length;

  if (loading) {
    return (
      <main className="game-container">
        <p>Memuat kartu hewan...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="game-container">
        <p>Gagal memuat kartu: {error}</p>
        <button onClick={() => window.location.reload()}>
          Coba Lagi
        </button>
      </main>
    );
  }

  if (animals.length === 0) {
    return (
      <main className="game-container">
        <p>Data hewan belum tersedia.</p>
      </main>
    );
  }

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

      <div className="card-grid">
        {cards.map((card) => {
          const isOpen =
            opened.includes(card.cardId) ||
            matched.includes(card.id_card);

          return (
            <button
              key={card.cardId}
              className={`animal-card ${isOpen ? "open" : ""}`}
              onClick={() => flipCard(card)}
              disabled={
                matched.includes(card.id_card) ||
                opened.includes(card.cardId) ||
                opened.length === 2
              }
            >
              {isOpen ? (
                <>
                  <span className="animal-emoji">
                    {card.emoji}
                  </span>

                  <span className="animal-name">
                    {card.name}
                  </span>
                </>
              ) : (
                <span className="question-mark">?</span>
              )}
            </button>
          );
        })}
      </div>

      {finished && (
        <div className="win-message">
          <h2>🎉 Hebat! Semua pasangan ditemukan!</h2>
          <p>Jumlah percobaan kamu: {moves}</p>
        </div>
      )}

      <button
        className="restart-button"
        onClick={restartGame}
      >
        🔄 Ulangi Permainan
      </button>
    </main>
  );
}
