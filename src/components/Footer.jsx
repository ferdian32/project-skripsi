import { listMenuHeader } from "../utils/listMenuHeader";

const FooterComponent = () => {
  return (
    <footer className="bg-green-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identitas Website */}
          <div>
            <h2 className="text-2xl font-bold text-green-300 mb-3">
              🐾 Petualangan Dunia Hewan
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Media edukasi interaktif untuk mengenal berbagai jenis hewan,
              habitat, dan keunikan yang dimilikinya.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Navigasi</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {listMenuHeader &&
                listMenuHeader.map((item) => {
                  return (
                    <li>
                      <a href={item.link} className="hover:text-green-300">
                        {item.path}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tentang Kami</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Website ini dibuat sebagai sarana pembelajaran untuk meningkatkan
              pengetahuan dan kepedulian masyarakat terhadap dunia hewan.
            </p>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-5 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Petualangan Dunia Hewan. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
