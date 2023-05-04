import React from 'react'
import Sidebar from './Sidebar'
import Chat from './Chat'

const ChatPage = () => {
  return (
    <div className='home'>
      <div className="chatPageConainer">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default ChatPage