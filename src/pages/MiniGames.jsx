import {
  ArrowLeft,
  Settings,
  Volume2,
  BookOpen,
  Brain,
  Gamepad2,
  Star,
  PawPrint,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MiniGames = () => {
  const navigate = useNavigate();
  const games = [
    {
      id: 1,
      title: "Kuis Tebak Hewan",
      description:
        "Tebak nama hewan berdasarkan gambar dan petunjuk yang diberikan. Uji pengetahuanmu dan dapatkan skor!",
      icon: Gamepad2,
      emoji: "🐼",
      color: "blue",
      bg: "from-sky-300 to-blue-500",
      light: "bg-sky-50",
      border: "border-sky-200",
      button: "bg-gradient-to-b from-sky-400 to-blue-600 border-blue-700",
      text: "text-blue-900",
      route: "/quiz",
    },
    {
      id: 2,
      title: "Memory Card",
      description:
        "Temukan dan cocokkan kartu bergambar hewan yang sama. Asah daya ingatmu dengan permainan yang menyenangkan!",
      icon: Brain,
      emoji: "🦁",
      color: "green",
      bg: "from-lime-300 to-green-500",
      light: "bg-green-50",
      border: "border-green-200",
      button: "bg-gradient-to-b from-green-400 to-green-600 border-green-700",
      text: "text-green-900",
      route: "/memory-card",
    },
  ];

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-sky-300 via-sky-100 to-green-300">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-green-400/50 blur-3xl" />
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-blue-300/50 blur-3xl" />

        <div className="absolute bottom-0 h-48 w-full bg-linear-to-t from-green-600 to-green-300/0" />

        <span className="absolute left-8 top-32 text-5xl">🌳</span>
        <span className="absolute right-10 top-40 text-5xl">🌳</span>
        <span className="absolute bottom-10 left-10 text-4xl">🌼</span>
        <span className="absolute bottom-16 right-12 text-4xl">🌸</span>
        <span className="absolute bottom-5 left-1/3 text-3xl">🌿</span>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-5">
        <button
          onClick={() => navigate("/games")}
          className="flex items-center gap-2 rounded-full border-2 border-white bg-linear-to-b from-emerald-400 to-emerald-700 px-5 py-3 font-bold text-white shadow-lg transition hover:scale-105 cursor-pointer"
        >
          <ArrowLeft size={20} />
          Beranda
        </button>
      </header>

      {/* Content */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-5">
        {/* Title */}
        <div className="relative mb-5 -rotate-1 rounded-[30px] border-[5px] border-amber-900 bg-linear-to-b from-amber-600 to-amber-800 px-10 py-4 text-center shadow-[0_8px_0_#713f12] sm:px-20">
          <h1 className="text-3xl font-black text-white drop-shadow-md sm:text-5xl">
            Pilih Game
          </h1>

          <p className="mt-1 text-lg font-extrabold text-yellow-200 sm:text-2xl">
            Jelajahi Dunia Hewan!
          </p>

          <span className="absolute -left-4 top-5 text-4xl">🐾</span>
          <span className="absolute -right-4 top-5 text-4xl">🐾</span>
        </div>

        {/* Subtitle */}
        <div className="mb-10 text-center">
          <p className="max-w-2xl text-base font-bold text-blue-950 sm:text-xl">
            Pilih salah satu game yang ingin kamu mainkan dan mulai petualangan
            seru mengenal hewan!
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-7 md:grid-cols-2">
          {games.map((game) => {
            const Icon = game.icon;

            return (
              <div
                key={game.id}
                className={`group overflow-hidden rounded-[35px] border-[6px] ${game.border} bg-white p-2 shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-2 hover:shadow-xl`}
              >
                {/* Card Image */}
                <div
                  className={`relative flex h-56 items-center justify-center overflow-hidden rounded-t-[25px] bg-linear-to-br ${game.bg}`}
                >
                  <span className="absolute left-5 top-5 text-3xl">✨</span>
                  <span className="absolute right-5 top-8 text-3xl">⭐</span>
                  <span className="absolute bottom-3 left-5 text-3xl">🌿</span>
                  <span className="absolute bottom-3 right-5 text-3xl">🌿</span>

                  {/* Game Icon */}
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-4 border-white/70 bg-white/30 shadow-inner transition duration-300 group-hover:scale-110">
                    <span className="text-8xl drop-shadow-lg">
                      {game.emoji}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-yellow-300 to-orange-400 text-white shadow-lg">
                    <Icon size={30} />
                  </div>
                </div>

                <div className={`${game.light} px-5 pb-5 pt-7 text-center`}>
                  <h2 className={`text-2xl font-black ${game.text}`}>
                    {game.title}
                  </h2>

                  <p
                    className={`mt-3 min-h-22.5 text-sm leading-relaxed ${game.text}`}
                  >
                    {game.description}
                  </p>

                  {/* Play Button */}
                  <button
                    onClick={() => navigate(game.route)}
                    className={`flex w-full items-center justify-center gap-3 rounded-full border-b-4 py-3 text-lg font-black text-white shadow-md transition hover:-translate-y-1 hover:brightness-105 active:translate-y-1 cursor-pointer active:border-b-0 ${game.button}`}
                  >
                    Mulai
                    <span className="text-2xl">➜</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="mt-10 flex items-center gap-2 rounded-full border-2 border-white bg-white/70 px-6 py-3 text-center shadow-md">
          <Star className="fill-yellow-400 text-yellow-500" />
          <p className="text-sm font-bold text-green-900">
            Belajar Hewan, Bermain dengan Gembira!
          </p>
          <Star className="fill-yellow-400 text-yellow-500" />
        </div>
      </section>
    </main>
  );
};

export default MiniGames;
