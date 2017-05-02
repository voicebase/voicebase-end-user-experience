import React, { PropTypes } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'voicebase-player/dist/voicebase-player.css'
import '../styles/core.scss'

function CoreLayout ({ children }) {
  return (
    <div className='page-container'>
      {children}
    </div>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element
}

export default CoreLayout
