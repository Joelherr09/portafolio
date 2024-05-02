import React from 'react'
import { useEffect } from 'react';
import { ImArrowUp } from "react-icons/im";

function handleScroll() {
  const botonSubirContenedor = document.querySelector('.boton-subir-contenedor');
  if (botonSubirContenedor) { // Comprueba si el elemento existe
    if (document.documentElement.scrollTop > 100) {
      botonSubirContenedor.classList.add('show');
    } else {
      botonSubirContenedor.classList.remove('show');
    }
  }
  
}

function handleClick() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}





const BotonSubir = () => {

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        const botonSubirContenedor = document.querySelector('.boton-subir-contenedor');
        if (botonSubirContenedor) {
          botonSubirContenedor.addEventListener('click', handleClick);
        }
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
          if (botonSubirContenedor) {
            botonSubirContenedor.removeEventListener('click', handleClick);
          }
        };
      }, []);


        useEffect(() => {
    // Encapsula la lógica del IntersectionObserver dentro del useEffect
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
          entry.target.classList.add('mostrar');
        } else {
          entry.target.classList.remove('mostrar');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.esconder');
    hiddenElements.forEach((el) => observer.observe(el));
  }, []);

  // Resto de su código React

  return (
    <div>
        <div className="boton-subir-contenedor ">
            <div className="boton-subir">
            <ImArrowUp color='white'/>

            </div>
        </div>
    </div>
  )
}

export default BotonSubir