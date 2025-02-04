import React, { useContext } from 'react'
import Hero from '../../Components/Hero/Hero'
import ProductList from '../../Components/ProductList/ProductList'
import { ShopContext } from '../../Components/ShopContext/ShopContext'

const Homepage = () => {
   const {heroVisible} = useContext(ShopContext)

  return (
    <div>
      {heroVisible && <Hero />}
      <ProductList />
    </div>
  )
}

export default Homepage