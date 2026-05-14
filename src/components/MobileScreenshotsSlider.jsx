import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import fourvoleiMobile from "../assets/mobile/4volei.jpeg";
import aperraMobile from "../assets/mobile/Aperra.jpeg";
import asvolcoMobile from "../assets/mobile/asvolco.jpeg";
import efisMobile from "../assets/mobile/efis.jpeg";
import lrpleMobile from "../assets/mobile/lrple.jpeg";

const screenshots = [
  { title: "4Volei", image: fourvoleiMobile, link: "https://4volei.vercel.app/" },
  { title: "Atlético EFIS", image: efisMobile, link: "https://atletico-efis.vercel.app/" },
  { title: "Aperra", image: aperraMobile, link: "https://aperra.vercel.app/" },
  { title: "ASVOLCO", image: asvolcoMobile, link: "https://asvolco.vercel.app/" },
  { title: "Liga Regional", image: lrpleMobile, link: "https://liga-panaderia-la-estrella.vercel.app/" },
];

const MobileScreenshotsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(1);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="w-full py-16 bg-[#041413]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#f39d52] mb-4">
            Vistas Móviles
          </h2>
          <p className="text-gray-400 text-lg">
            Experiencia responsive de los proyectos
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto h-[620px] flex items-center justify-center overflow-hidden">
          {screenshots.map((project, index) => {
            const diff = (index - currentIndex + screenshots.length) % screenshots.length;
            
            let translateX = 0;
            let scale = 0.75;
            let opacity = 0;
            let zIndex = 5;

            if (diff === 0) {                    // Centro
              translateX = 0;
              scale = 1;
              opacity = 1;
              zIndex = 30;
            } else if (diff === 1) {             // Derecha
              translateX = 260;
              scale = 0.82;
              opacity = 0.9;
              zIndex = 20;
            } else if (diff === screenshots.length - 1) { // Izquierda
              translateX = -260;
              scale = 0.82;
              opacity = 0.9;
              zIndex = 20;
            } 
            // Las demás imágenes quedan con opacity 0 (ocultas)

            return (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="absolute transition-all duration-700 ease-out"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-[260px] h-[520px] object-cover rounded-[2.75rem] shadow-2xl border-8 border-zinc-900"
                />
              </a>
            );
          })}

          {/* Botones superpuestos sobre la imagen central */}
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full border border-white/10 text-white transition-all hover:scale-110"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full border border-white/10 text-white transition-all hover:scale-110"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileScreenshotsSlider;