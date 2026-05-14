import React from "react";

import volei from "../assets/4voleiSS.png";
import Cabana from "../assets/SSCabana.webp";
import cuartavoleibol from "../assets/cuartavoleibolSS.png";
import aperra from "../assets/aperraSS.png";
import fe from '../assets/feSS.png';
import oxy from '../assets/oxySS.png';
import asvolco from '../assets/asvolcoSS.png';
import efis from '../assets/efisSS.png';
import lrple from '../assets/lrpleSS.png';

const proyectos = [
  {
    title: "4Volei",
    desc: "Plataforma completa para el vóley amateur chileno",
    img: volei,
    link: "https://4volei.vercel.app/",
    tech: ["Next.js", "Supabase", "shadcn"],
    badge: "Deporte",
    badgeColor: "bg-emerald-500",
    destacado: true
  },
  {
    title: "Aperra",
    desc: "App de adopción de mascotas con mensajería en tiempo real",
    img: aperra,
    link: "https://aperra.vercel.app/",
    tech: ["Next.js", "Supabase", "shadcn"],
    badge: "Social",
    badgeColor: "bg-purple-500"
  },
  {
    title: "ASVOLCO",
    desc: "Plataforma institucional para la Asociación de Vóleibol de Coquimbo",
    img: asvolco,
    link: "https://asvolco.vercel.app/",
    tech: ["Next.js", "Supabase"],
    badge: "Institución",
    badgeColor: "bg-blue-500"
  },
  {
    title: "CuartaVoleibol",
    desc: "Herramientas deportivas para ligas de vóley amateur",
    img: cuartavoleibol,
    link: "https://cuartavoleibol.netlify.app/",
    tech: ["React", "MySQL"],
    badge: "Deporte",
    badgeColor: "bg-emerald-500"
  },
  {
    title: "Atlético EFIS",
    desc: "Landing page para equipo competitivo de vóleibol",
    img: efis,
    link: "https://atletico-efis.vercel.app/",
    tech: ["Next.js", "Tailwind"],
    badge: "Deporte",
    badgeColor: "bg-emerald-500"
  },
  {
    title: "Liga Regional Panadería La Estrella",
    desc: "Landing page para liga regional de vóleibol",
    img: lrple,
    link: "https://liga-panaderia-la-estrella.vercel.app/",
    tech: ["Next.js", "Tailwind"],
    badge: "Deporte",
    badgeColor: "bg-emerald-500"
  },
  {
    title: "OxyVitalité",
    desc: "Landing page para centro de oxigenación hiperbárica",
    img: oxy,
    link: "https://oxyvitalite.vercel.app/",
    tech: ["Next.js", "Tailwind"],
    badge: "Salud",
    badgeColor: "bg-cyan-500"
  },
  {
    title: "Franco Extremo",
    desc: "Landing page para barbería premium",
    img: fe,
    link: "https://francoextremo.vercel.app/",
    tech: ["Next.js", "Tailwind"],
    badge: "Barbería",
    badgeColor: "bg-amber-500"
  },
  {
    title: "Playa Norte Cabañas",
    desc: "Landing page para complejo de cabañas",
    img: Cabana,
    link: "https://cabanacoq.netlify.app",
    tech: ["React", "Tailwind"],
    badge: "Turismo",
    badgeColor: "bg-orange-500"
  },
];

const Proyectos = () => {
  return (
    <div id="portafolio" className="w-full py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-center text-4xl md:text-5xl font-bold text-[#f39d52] mb-4">
          Proyectos Destacados
        </h1>
        <p className="text-center text-gray-400 text-lg mb-12">
          Algunos de los trabajos que más me enorgullecen
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proyectos.map((proyecto, index) => (
            <div 
              key={index}
              className="group bg-[#041413]/80 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:border-[#f39d52]/30 transition-all duration-300 hover:-translate-y-2"
            >
              <a href={proyecto.link} target="_blank" rel="noreferrer">
                <div className="relative overflow-hidden">
                  <img 
                    src={proyecto.img} 
                    alt={proyecto.title}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  {/* Badge Destacado (derecha) */}
                  {proyecto.destacado && (
                    <div className="absolute top-4 right-4 bg-[#f39d52] text-black text-xs font-bold px-3 py-1 rounded-full">
                      Destacado
                    </div>
                  )}

                  {/* Nuevo Badge de Tipo (izquierda) */}
                  <div className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full text-white ${proyecto.badgeColor}`}>
                    {proyecto.badge}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white">{proyecto.title}</h3>
                  <p className="text-gray-400 mt-2 line-clamp-2">{proyecto.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-5">
                    {proyecto.tech.map((t, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-white/5 px-3 py-1 rounded-xl text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Proyectos;