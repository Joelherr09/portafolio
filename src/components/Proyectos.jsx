import React from "react";

import CVSS from "../assets/cvSS.webp";
import Vendepo from "../assets/VendepoSS.webp";
import Cabana from "../assets/SSCabana.webp";
import Ecommerce from "../assets/SSEcommerce.webp";

const Proyectos = () => {
  return (
    <div className="w-full md:py-4">
        <h1 className="text-center text-2xl font-bold text-white md:text-3xl md:font-black">Proyectos Realizados</h1>
      <div className="w-[90%] mx-auto text-white  p-2 flex flex-col gap-4 md:gap-3 md:grid md:grid-cols-2">
        
        <div className="bg-slate-700/80 drop-shadow-lg shadow-lg shadow-blue-500/50 p-3 hover:scale-105 duration-300">
          <a href="" target="_blank" rel="noreferrer">
            <img src={Vendepo} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold">Vende Po!</h4>
                <p>Landing Page de mi Emprendimiento de Desarrollo Web</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">React</p>
                    <p className="bg-black rounded-xl px-3">Tailwind</p>
                </div>
            </div>
          </a>
        </div>
        <div className="bg-slate-700/80 drop-shadow-lg shadow-lg shadow-blue-500/50 p-3 hover:scale-105 duration-300">
          <a href="" target="_blank" rel="noreferrer">
            <img src={CVSS} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold">Cuarta Voleibol</h4>
                <p>Aplicación Web de escena competitiva de Vóleibol.</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">React</p>
                    <p className="bg-black rounded-xl px-3">Appwrite</p>
                </div>
            </div>
          </a>
        </div>
        <div className="bg-slate-700/80 drop-shadow-lg shadow-lg shadow-blue-500/50 p-3 hover:scale-105 duration-300">
          <a href="" target="_blank" rel="noreferrer">
            <img src={Cabana} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold">Playa Norte</h4>
                <p>Landing Page para negocio de Cabañas</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">React</p>
                    <p className="bg-black rounded-xl px-3">Tailwind</p>
                </div>
            </div>
          </a>
        </div>
        <div className="bg-slate-700/80 drop-shadow-lg shadow-lg shadow-blue-500/50 p-3 hover:scale-105 duration-300">
          <a href="" target="_blank" rel="noreferrer">
            <img src={Ecommerce} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold">E-commerce</h4>
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
