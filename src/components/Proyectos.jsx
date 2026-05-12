import React from "react";

import volei from "../assets/4voleiSS.png";
import Cabana from "../assets/SSCabana.webp";
import cuartavoleibol from "../assets/cuartavoleibolSS.png";
import aperra from "../assets/aperraSS.png"
import fe from '../assets/feSS.png'
import oxy from '../assets/oxySS.png'
import asvolco from '../assets/asvolcoSS.png'

const Proyectos = () => {
  return (
    <div id="portafolio" className="w-full py-12">
      <h1 className="text-center text-3xl md:text-4xl font-bold text-[#f39d52] mb-10">
        Proyectos Realizados
      </h1>

      <div className="w-[90%] mx-auto grid md:grid-cols-2 gap-6">
        
        {/* Proyecto 1 */}
        <div className="group bg-[#041413]/80 backdrop-blur-lg border border-white/10 
                        rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 
                        transition-all duration-300">
          <a href="https://4volei.vercel.app/" target="_blank" rel="noreferrer">
            <img 
              src={volei} 
              alt="4Volei" 
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-[#f39d52]">4Volei</h4>
              <p className="text-gray-300 mt-1">Web Informática del Vóleibol Amateur</p>
              <div className="flex gap-3 mt-4 flex-wrap text-white">
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">Next.js</span>
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">Supabase</span>
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">shadcn</span>
              </div>
            </div>
          </a>
        </div>

        {/* Repetir el mismo patrón para los demás proyectos */}
        <div className="group bg-[#041413]/80 backdrop-blur-lg border border-white/10 
                        rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 
                        transition-all duration-300">
          <a href="https://aperra.vercel.app/" target="_blank" rel="noreferrer">
            <img src={aperra} alt="Aperra" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-[#f39d52]">Aperra</h4>
              <p className="text-gray-300 mt-1">Plataforma para adopción de mascotas con mensajería</p>
              <div className="flex gap-3 mt-4 flex-wrap text-white">
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">Next.js</span>
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">Supabase</span>
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">shadcn</span>
              </div>
            </div>
          </a>
        </div>

        <div className="group bg-[#041413]/80 backdrop-blur-lg border border-white/10 
                        rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 
                        transition-all duration-300">
          <a href="https://asvolco.vercel.app/" target="_blank" rel="noreferrer">
            <img src={asvolco} alt="ASVOLCO" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-[#f39d52]">ASVOLCO</h4>
              <p className="text-gray-300 mt-1">Plataforma institucional de Vóleibol</p>
              <div className="flex gap-3 mt-4 flex-wrap text-white">
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">Next.js</span>
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">Supabase</span>
              </div>
            </div>
          </a>
        </div>

        <div className="group bg-[#041413]/80 backdrop-blur-lg border border-white/10 
                        rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 
                        transition-all duration-300">
          <a href="https://cuartavoleibol.netlify.app/" target="_blank" rel="noreferrer">
            <img src={cuartavoleibol} alt="Cuarta Voleibol" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-[#f39d52]">CuartaVoleibol</h4>
              <p className="text-gray-300 mt-1">Aplicación web con herramientas deportivas</p>
              <div className="flex gap-3 mt-4 flex-wrap text-white">
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">React</span>
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">MySQL</span>
              </div>
            </div>
          </a>
        </div>

        {/* Puedes continuar con los demás proyectos siguiendo el mismo patrón... */}

        <div className="group bg-[#041413]/80 backdrop-blur-lg border border-white/10 
                        rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 
                        transition-all duration-300">
          <a href="https://cabanacoq.netlify.app" target="_blank" rel="noreferrer">
            <img src={Cabana} alt="Cabañas" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-[#f39d52]">Playa Norte Cabañas</h4>
              <p className="text-gray-300 mt-1">Landing Page para negocio de cabañas</p>
              <div className="flex gap-3 mt-4 flex-wrap text-white">
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">React</span>
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">Tailwind</span>
              </div>
            </div>
          </a>
        </div>

        <div className="group bg-[#041413]/80 backdrop-blur-lg border border-white/10 
                        rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 
                        transition-all duration-300">
          <a href="https://oxyvitalite.vercel.app/" target="_blank" rel="noreferrer">
            <img src={oxy} alt="Cabañas" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-[#f39d52]">OxyVitalité</h4>
              <p className="text-gray-300 mt-1">Landing page para negocio de oxigenación hiperbárica.</p>
              <div className="flex gap-3 mt-4 flex-wrap text-white">
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">NextJS</span>
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">Tailwind</span>
              </div>
            </div>
          </a>
        </div>

        <div className="group bg-[#041413]/80 backdrop-blur-lg border border-white/10 
                        rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 
                        transition-all duration-300">
          <a href="https://francoextremo.vercel.app/" target="_blank" rel="noreferrer">
            <img src={fe} alt="Cabañas" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-[#f39d52]">Barbería | FrancoE</h4>
              <p className="text-gray-300 mt-1">Landing Page para barbería</p>
              <div className="flex gap-3 mt-4 flex-wrap text-white">
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">NextJS</span>
                <span className="bg-black/50 text-xs px-3 py-1 rounded-xl">Tailwind</span>
              </div>
            </div>
          </a>
        </div>

        {/* Agrega los restantes (Oxy, FrancoE, E-commerce) de la misma forma */}

      </div>
    </div>
  );
};

export default Proyectos;