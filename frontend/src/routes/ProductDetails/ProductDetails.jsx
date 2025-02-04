import React, { useContext } from 'react'

import { useParams } from 'react-router-dom'

import { productsData } from '../../data'

import './ProductDetails.css'

import { ShopContext } from '../../Components/ShopContext/ShopContext'

const ProductDetails = () => {

  const {addToCart} = useContext(ShopContext);

  // get product id
  const { id } = useParams()

  // get product based on id
  const product = productsData.find(product=> {
    return product.id === parseInt(id);
  })

  return (
    <div>
      <div className="product_details">
        <div className="detail_left">
          <img src={product.image} alt="" />
        </div>
        <div className="detail_right">
          <h3>{product.title} </h3>
          <p className="product_price">$ {product.price} </p>
          <p className="desc">{product.description} </p>
          <button onClick={()=> addToCart(product, id)}>ADD TO CART</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails