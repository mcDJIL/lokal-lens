import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full bg-[#221C10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-12 mb-8">
          <div className="w-full lg:w-[280px] flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image src="/assets/img/logo-white.png" alt="LokalLens Logo" width={40} height={40} />
              <h2 className="text-lg font-bold leading-7 text-[#F8F7F5]">
                LokalLens
              </h2>
            </div>
            <p className="text-sm font-normal leading-5 text-[#A19886]">
              Platform digital untuk melestarikan dan
              berbagi kekayaan budaya Indonesia.
            </p>
          </div>

          <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-bold leading-6 tracking-[0.4px] text-[#F8F7F5]">
                Navigasi
              </h3>
              <div className="flex flex-col gap-2">
                <a href="/jelajahi" className="text-sm font-normal leading-5 text-[#A19886] hover:text-[#F8F7F5] transition-colors">
                  Jelajahi Budaya
                </a>
                <a href="/artikel" className="text-sm font-normal leading-5 text-[#A19886] hover:text-[#F8F7F5] transition-colors">
                  Artikel
                </a>
                <a href="/event-budaya" className="text-sm font-normal leading-5 text-[#A19886] hover:text-[#F8F7F5] transition-colors">
                  Event
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-base font-bold leading-6 tracking-[0.4px] text-[#F8F7F5]">
                Tentang
              </h3>
              <div className="flex flex-col gap-2">
                <a href="/tentang-kami" className="text-sm font-normal leading-5 text-[#A19886] hover:text-[#F8F7F5] transition-colors">
                  Tentang Kami
                </a>
                <a href="#" className="text-sm font-normal leading-5 text-[#A19886] hover:text-[#F8F7F5] transition-colors">
                  Kontak
                </a>
                <a href="#" className="text-sm font-normal leading-5 text-[#A19886] hover:text-[#F8F7F5] transition-colors">
                  Kebijakan Privasi
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-base font-bold leading-6 tracking-[0.4px] text-[#F8F7F5]">
                Ikuti Kami
              </h3>
              <div className="flex flex-col gap-2">
                <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/lokallenss?igsh=MWl5bHh5cXhiMjdvag==" className="text-sm font-normal leading-5 text-[#A19886] hover:text-[#F8F7F5] transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-sm font-normal leading-5 text-[#A19886] hover:text-[#F8F7F5] transition-colors">
                  YouTube
                </a>
                <a href="#" className="text-sm font-normal leading-5 text-[#A19886] hover:text-[#F8F7F5] transition-colors">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="">
            <div className="border-t border-[#3C3629] w-full sm:w-3/4 mx-auto"></div>
          <p className="pt-6 sm:pt-8 text-xs sm:text-sm font-normal leading-5 text-[#A19886] text-center">
            © 2025 LokalLens. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
