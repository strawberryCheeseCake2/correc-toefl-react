import React from 'react'
import "./prompt.css"

function Prompt() {
  return (
    <div>
      <h1>라이팅 토론형 문제 첨삭기</h1>
      <div className="prompt-container">
        
        <textarea 
          className="prompt-textarea"
          rows={10}
        />
      </div>
      
      
    </div>
  )
}

export default Prompt