import React, { useRef } from 'react'
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
            console.log('SUCCESS!');
          },
          (error) => {
            console.log('FAILED...', error.text);
          },
        );
    };    

    const notify = () => {
       //toast("Correo enviado!");
        toast.success("Correo enviado!", {
            position: "top-center",
          });
    }

  return (
    
    <div id='contacto' className='w-[100%] md:w-[70%] mx-auto text-white bg-slate-700/80 drop-shadow-lg shadow-lg shadow-blue-500/50 p-3 my-10'>
        
        <h1 className='text-center text-2xl font-semibold md:text-3xl md:font-black'>Contáctame</h1>
        <div className=' w-full mx-auto justify-center flex flex-col items-center'>
            <h1 className='text-center text-2xl font-bold py-4 text-red-600'>joelherreraleiva@gmail.com</h1>


            <div className='w-[90%]'>
                <form ref={form} onSubmit={sendEmail} id="contact-form" className='flex flex-col w-full'>
                
                    <input type="hidden" name="contact_number" value="697483" />
                    <div className='flex flex-col md:flex-row w-full gap-2'>
                        <div className='flex flex-col w-full'>
                            <label>Nombre</label>
                            <input type="text" name="user_name" className='text-black p-1' />
                        </div>
                        <div className='flex flex-col  w-full'>
                            <label>Email</label>
                            <input type="email" name="user_email" className='text-black p-1' />
                        </div>
                    </div>

                    <label>Mensaje</label>
                    <textarea name="message" rows="5" className='text-black p-1'></textarea>
                    <input onClick={notify} type="submit" value="Enviar" className='bg-[#130f40] py-1 my-2 hover:bg-[#2c266c]' /><ToastContainer />
                    
                </form>
            </div>

            <ToastContainer />
        </div>
    </div>
  );
};

export default Contacto;