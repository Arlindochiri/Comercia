import React from 'react'
import { BsInstagram, BsTwitterX } from 'react-icons/bs'
import { FaFacebook } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <div>
      <div className="footer">
        <div className="footer_content">
          <div className="footer_name">
            <h2>LOGOHERE</h2>
          </div>
          <div className="footer_socials">
            <FaFacebook className='footer_icon' />
            <BsInstagram className='footer_icon'/>
            <BsTwitterX className='footer_icon' />
          </div>
        </div>
       <div className="copy">
        <p>Copyright © LOGOHERE 2024. All rights reserved</p>
       </div>
      </div>
    </div>
  )
}

export default Footer