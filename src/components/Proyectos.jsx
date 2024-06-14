import React from "react";

import CVSS from "../assets/cvSS.webp";
import Vendepo from "../assets/VendepoSS.webp";
import Cabana from "../assets/SSCabana.webp";
import Ecommerce from "../assets/SSEcommerce.webp";
import LDES from "../assets/LDESSS.webp";

const Proyectos = () => {
  return (
    <div id="portafolio" className="w-full md:py-4 py-6">
        <h1 className="text-center text-2xl font-bold text-[#f39d52] md:text-3xl md:font-black">Proyectos Realizados</h1>
      <div className="w-[90%] mx-auto text-white  p-2 flex flex-col gap-4 md:gap-4 md:grid md:grid-cols-2">
        
        <div className="bg-[#0c2c27] drop-shadow-lg  p-3 hover:shadow-lg hover:shadow-orange-500/50 duration-300 hover:bg-[#163f38]">
          <a href="https://www.vendepo.cl/" target="_blank" rel="noreferrer">
            <img src={Vendepo} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold text-[#fded3f]">Vende Po!</h4>
                <p>Landing Page de mi Emprendimiento de Desarrollo Web</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">React</p>
                    <p className="bg-black rounded-xl px-3">Tailwind</p>
                </div>
            </div>
          </a>
        </div>
        <div className="bg-[#0c2c27] drop-shadow-lg  p-3 hover:shadow-lg hover:shadow-orange-500/50 duration-300 hover:bg-[#163f38]">
          <a href="https://ldes.rf.gd/" target="_blank" rel="noreferrer">
            <img src={LDES} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold text-[#fded3f]">Liga de Educación Superior IV Región</h4>
                <p>Aplicación Web de Liga de Educación Superior de Vóleibol de la IV Región de Chile.</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">PHP</p>
                    <p className="bg-black rounded-xl px-3">MySQL</p>
                </div>
            </div>
          </a>
        </div>
        <div className="bg-[#0c2c27] drop-shadow-lg  p-3 hover:shadow-lg hover:shadow-orange-500/50 duration-300 hover:bg-[#163f38]">
          <a href="https://www.cuartavoleibol.online/" target="_blank" rel="noreferrer">
            <img src={CVSS} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold text-[#fded3f]">Cuarta Voleibol</h4>
                <p>Aplicación Web de escena competitiva de Vóleibol.</p>
                <div className="flex gap-4 pt-1">
                    <p className="bg-black rounded-xl px-3">React</p>
                    <p className="bg-black rounded-xl px-3">Appwrite</p>
                </div>
            </div>
          </a>
        </div>
        <div className="bg-[#0c2c27] drop-shadow-lg  p-3 hover:shadow-lg hover:shadow-orange-500/50 duration-300 hover:bg-[#163f38]">
          <a href="https://programaconerick.site/" target="_blank" rel="noreferrer">
            <img src={Cabana} alt="" />
            <div className="py-1">
                <h4 className="text-2xl font-semibold text-[#fded3f]">Playa Norte</h4>
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
                <h4 className="text-2xl font-semibold text-[#fded3f]">E-commerce</h4>
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
