import React, { useState } from 'react';
import { FaMagic } from 'react-icons/fa';
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

  return (
    <div className="ai-prompt-input">
      <button className="magic-button" onClick={handleButtonClick}>
        <FaMagic />
      </button>
      {isInputVisible && (
        <div className="prompt-container">
          <input
            type="text"
            value={prompt}
            onChange={handleInputChange}
            placeholder="Enter your prompt"
          />
          <button onClick={handleSubmit}>Accept</button>
        </div>
      )}
    </div>
  );
}

export default AIPromptInput;