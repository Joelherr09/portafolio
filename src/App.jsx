import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Proyectos from './components/Proyectos';
import Contacto from './components/Contacto';
import BotonSubir from './components/BotonSubir';
import Servicios from './components/Servicios';

const App = () => {

  // Observer para animaciones al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mostrar');
        }
      });
    }, {
      threshold: 0.15,        // Se activa cuando el 15% del elemento es visible
      rootMargin: "0px 0px -50px 0px"
    });

    const hiddenElements = document.querySelectorAll('.esconder');
    hiddenElements.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020a09]">   {/* Fondo oscuro con contraste */}
      
      <Navbar />

      <main>
        {/* Hero - Sin animación porque está al principio */}
        <div id="home">
          <Hero />
        </div>

        
          <Proyectos />
          <Servicios />



        <div className="esconder">
          <Contacto />
        </div>
      </main>

      <Footer />
      <BotonSubir />
    </div>
  );
};

export default App;