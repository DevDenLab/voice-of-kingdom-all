import React from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"

 const NavB = () => {
  return (
    <div className='nav'>
    <ul className='nav-text'>
      <div className='navLeft'>
        <li> <Link to = '/'>Home</Link></li>
        <li><Link to = '/biography'>About</Link> </li>
        <li>Home</li>
      </div>
      <div className='navMid'>
        <li className='logo'><img src="/static/favicon.jpg" alt="VOKIM" /></li> 
      </div>
      <div className='navRight'>
        <li>Home</li>
        <li>Home</li>
        <li>Home</li>
      </div>
      
    </ul>
    </div>
  )
}

export default NavB