import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='bg-img'>
        <Navbar/>
        <Hero/>

        <Footer/>
    </div>
  )
}

export default App