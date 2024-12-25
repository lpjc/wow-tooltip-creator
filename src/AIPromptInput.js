import React, { useState } from 'react';
import { FaHatWizard } from "react-icons/fa6";
import './AIPromptInput.css';

function AIPromptInput({ onPromptSubmit }) {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleButtonClick = () => {
    setIsInputVisible(!isInputVisible);
  };

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = () => {
    onPromptSubmit(prompt);
    setPrompt('');
    setIsInputVisible(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`ai-prompt-input ${isInputVisible ? 'expanded' : ''}`}>
      
      <button className="magic-button" onClick={handleButtonClick}> 
        <FaHatWizard className='magic-icon'/>
        <br/>
        Prompt-a-tooltip      
      </button>
      {isInputVisible && (
        <div className="prompt-container">
          <input
            type="text"
            value={prompt}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt"
          />
          <button onClick={handleSubmit}>Accept</button>
        </div>
      )}
    </div>
  );
}

export default AIPromptInput;