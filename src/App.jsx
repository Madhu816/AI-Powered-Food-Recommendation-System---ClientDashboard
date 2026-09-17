import React from 'react'
import LandingPage from './suby/pages/LandingPage'
import { Routes, Route } from "react-router-dom"
import ProductMenu from './suby/components/ProductMenu'
import "./App.css"
import { CartProvider } from './suby/cart/CartContext'
import CartPanel from './suby/components/CartPanel'


const App = () => {
  return (
    <CartProvider>
      <CartPanel />
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path='/products/:firmId/:firmname' element={<ProductMenu/>}/>
      </Routes>
    </CartProvider>
  )
}

export default App
