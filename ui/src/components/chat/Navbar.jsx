import React from 'react'
import "./style.css"

const Navbar = () => {
  const currentUser = {
    uid: "1",
    displayName: "display_name",
    photoURL : "photo_url"
  };
  return (
    <div className='navbar'>
      <span className="logo">Lama Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button>logout</button>
      </div>
    </div>
  )
}

export default Navbar