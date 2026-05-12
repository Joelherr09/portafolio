import React from 'react';
import { FaCode, FaShoppingCart, FaRocket, FaTools, FaMobileAlt } from 'react-icons/fa';

const Servicios = () => {
  const services = [
    {
      icon: <FaCode size={40} />,
      title: "Desarrollo Web Fullstack",
      desc: "Sitios y aplicaciones web completas, rápidas y escalables con las mejores tecnologías actuales.",
      tech: "Next.js • React • Supabase • Node.js"
    },
    {
      icon: <FaRocket size={40} />,
      title: "Landing Pages de Alto Impacto",
      desc: "Páginas de venta optimizadas para convertir visitantes en clientes.",
      tech: "Next.js • Tailwind • Animaciones"
    },
    {
      icon: <FaShoppingCart size={40} />,
      title: "Tiendas Online (E-commerce)",
      desc: "Tiendas profesionales con carrito, pagos y gestión de inventario.",
      tech: "Next.js • Supabase • Stripe"
    },
    {
      icon: <FaMobileAlt size={40} />,
      title: "Diseño Responsive",
      desc: "Experiencias perfectas en móviles, tablets y escritorio.",
      tech: "Mobile First"
    },
    {
      icon: <FaTools size={40} />,
      title: "Mantenimiento y Optimización",
      desc: "Actualizaciones, mejoras de velocidad, SEO y soporte continuo.",
      tech: "Vercel • Git • Monitoring"
    },
  ];

  return (
    <div id="servicios" className="w-full py-16 bg-[#041413]/40">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-center text-4xl font-bold text-[#f39d52] mb-4 esconder">
          Mis Servicios
        </h1>
        <p className="text-center text-gray-400 mb-12 text-lg esconder">
          Convierto tus ideas en productos digitales profesionales
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#041413]/80 backdrop-blur-lg border border-white/10 
                         rounded-3xl p-8 hover:border-orange-500/30 hover:shadow-xl 
                         hover:shadow-orange-500/20 transition-all duration-300 group esconder"
            >
              <div className="text-[#f39d52] mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                {service.desc}
              </p>
              <p className="text-xs uppercase tracking-widest text-orange-400">
                {service.tech}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="#contacto"
            className="inline-block bg-[#f39d52] hover:bg-orange-500 text-black font-semibold 
                       px-10 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105"
          >
            Solicitar Presupuesto
          </a>
        </div>
      </div>
    </div>
  );
};

export default Servicios;