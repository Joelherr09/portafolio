import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contacto = () => {
    const form = useRef();

    const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs
        .sendForm('service_sp4cgli', 'template_bjjx2co', form.current, {
          publicKey: 'eGNrhv37yvETeqzRS',
        })
        .then(
          () => {
            toast.success("¡Correo enviado correctamente!", { position: "top-center" });
            form.current.reset();
          },
          (error) => {
            toast.error("Error al enviar el mensaje", { position: "top-center" });
            console.log('FAILED...', error.text);
          },
        );
    };

  return (
    <div id='contacto' className='w-full max-w-3xl mx-auto py-16 px-4'>
      <div className='bg-[#041413]/80 backdrop-blur-lg border border-white/10 
                      rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/60'>
        
        <h1 className='text-center text-4xl font-bold text-[#f39d52] mb-2'>
          Contáctame
        </h1>
        <p className='text-center text-gray-400 mb-8'>
          Estoy disponible para nuevos proyectos
        </p>

        <div className='text-center mb-8'>
          <a 
            href="mailto:joelherreraleiva@gmail.com" 
            className='text-xl md:text-2xl font-bold text-red-400 hover:text-red-500 transition-colors'
          >
            joelherreraleiva@gmail.com
          </a>
        </div>

        <div className='w-full'>
          <form ref={form} onSubmit={sendEmail} className='flex flex-col gap-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='flex flex-col'>
                <label className='text-[#f39d52] mb-2 font-medium'>Nombre</label>
                <input 
                  type="text" 
                  name="user_name" 
                  required
                  className='bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#f39d52]/50 transition-all' 
                />
              </div>
              <div className='flex flex-col'>
                <label className='text-[#f39d52] mb-2 font-medium'>Email</label>
                <input 
                  type="email" 
                  name="user_email" 
                  required
                  className='bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#f39d52]/50 transition-all' 
                />
              </div>
            </div>

            <div className='flex flex-col'>
              <label className='text-[#f39d52] mb-2 font-medium'>Mensaje</label>
              <textarea 
                name="message" 
                rows="6" 
                required
                className='bg-white/10 border border-white/20 rounded-3xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#f39d52]/50 transition-all resize-none'
              ></textarea>
            </div>

            <input 
              type="submit" 
              value="Enviar Mensaje" 
              className='bg-[#f39d52] hover:bg-orange-500 text-black font-semibold py-4 rounded-2xl text-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] mt-4'
            />
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default Contacto;