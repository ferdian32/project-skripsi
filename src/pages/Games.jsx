import { useState } from "react";
import { Volume2, VolumeX, Settings, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GamesPage = () => {
  const [sound, setSound] = useState(true);
  const navigate = useNavigate();
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: "url('/images/bg-games.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Settings */}
      <div className="absolute right-5 top-5 z-20 flex gap-3">
        <button
          onClick={() => setSound(!sound)}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-slate-700 text-white shadow-lg transition hover:scale-110"
        >
          {sound ? <Volume2 /> : <VolumeX />}
        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-slate-700 text-white shadow-lg transition hover:scale-110">
          <Settings />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        {/* Game Title */}
        <div className="mb-28 -rotate-2 rounded-[25px] border-[5px] border-[#75401d] bg-linear-to-b from-[#c47b3c] to-[#85451e] px-7 py-2 text-center shadow-[0_6px_0_#593016] sm:mb-32">
          <p className="text-lg font-black text-white drop-shadow-md">
            ✈ Petualangan
          </p>

          <h1 className="text-3xl font-black tracking-tight text-yellow-300 drop-shadow-[2px_3px_0_#713b16] sm:text-5xl">
            Dunia Hewan
          </h1>

          <div className="mt-1 rounded-full bg-teal-900 px-4 py-1 text-xs font-bold text-white">
            Belajar · Bermain · Mengenal Hewan
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={() => navigate("/mini-games")}
          className="flex items-center gap-3 rounded-2xl border-b-[5px] border-orange-600 bg-linear-to-b from-yellow-300 to-orange-400 px-8 py-3 text-xl font-black text-white shadow-xl transition hover:-translate-y-1 hover:brightness-105 active:translate-y-1 active:border-b-0 sm:px-12 sm:text-2xl"
        >
          <Play size={28} fill="white" />
          Mulai Bermain
        </button>
      </div>
    </section>
  );
};

export default GamesPage;
