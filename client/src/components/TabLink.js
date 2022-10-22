import React from 'react'

const TabLink = ({text, onClick, active}) => {
  return (
    <div className={`p-3 h-12 cursor-pointer bg-gray-400 hover:bg-gray-600 text-white flex items-center justify-center ${active ? "border-t-4 border-red-500" : ""}`} onClick={onClick}>
        {text}
    </div>
  )
}

export default TabLink
