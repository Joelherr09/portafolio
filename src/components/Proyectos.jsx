import React from "react";

import volei from "../assets/4voleiSS.png";
import Cabana from "../assets/SSCabana.webp";
import Ecommerce from "../assets/SSEcommerce.webp";
import cuartavoleibol from "../assets/cuartavoleibolSS.png";

const Proyectos = () => {
  return (
    <div id="portafolio" className="w-full md:py-4 py-6">
        <h1 className="text-center text-2xl font-bold text-[#f39d52] md:text-3xl md:font-black">Proyectos Realizados</h1>
      <div className="w-[90%] mx-auto text-white  p-2 flex flex-col gap-4 md:gap-4 md:grid md:grid-cols-2">
        
        <div className="bg-[#0c2c27] drop-shadow-lg  p-3 hover:shadow-lg hover:shadow-orange-500/50 duration-300 hover:bg-[#163f38]">
          <a href="https://4volei.vercel.app/" target="_blank" rel="noreferrer">
            <img src={volei} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold text-[#f39d52]">4Volei</h4>
                <p>Web Informatica del Vóleibol Amateur</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">Nextjs</p>
                    <p className="bg-black rounded-xl px-3">Supabase</p>
                    <p className="bg-black rounded-xl px-3">shadcn</p>
                </div>
            </div>
          </a>
        </div>
        <div className="bg-[#0c2c27] drop-shadow-lg  p-3 hover:shadow-lg hover:shadow-orange-500/50 duration-300 hover:bg-[#163f38]">
          <a href="https://cuartavoleibol.netlify.app/" target="_blank" rel="noreferrer">
            <img src={cuartavoleibol} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold text-[#f39d52]">cuartavoleibol</h4>
                <p>Aplicación Web de Vóleibol Amateur con herramientas deportivas.</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">React</p>
                    <p className="bg-black rounded-xl px-3">MySQL</p>
                    <p className="bg-black rounded-xl px-3">MaterialUI</p>
                </div>
            </div>
          </a>
        </div>
        <div className="bg-[#0c2c27] drop-shadow-lg  p-3 hover:shadow-lg hover:shadow-orange-500/50 duration-300 hover:bg-[#163f38]">
          <a href="https://cabanacoq.netlify.app" target="_blank" rel="noreferrer">
            <img src={Cabana} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold text-[#f39d52]s">Playa Norte</h4>
                <p>Landing Page para negocio de Cabañas</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">React</p>
                    <p className="bg-black rounded-xl px-3">Tailwind</p>
                </div>
            </div>
          </a>
        </div>
        <div className="bg-[#0c2c27] drop-shadow-lg  p-3 hover:shadow-lg hover:shadow-orange-500/50 duration-300 hover:bg-[#163f38]">
          <a href="https://ecommercechile.netlify.app/" target="_blank" rel="noreferrer">
            <img src={Ecommerce} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold text-[#f39d52]">E-commerce</h4>
                <p>Front-end de E-commerce</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">React</p>
                </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Proyectos;
