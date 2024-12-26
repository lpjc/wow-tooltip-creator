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

  const handleSubmit = async () => {
    try {
      const messages = [
        {
          role: 'system',
          content:
            'You specialize in generating unique and creative WoW abilities...'
        },
        { role: 'user', content: prompt }
      ];
  
      // Full server URL for local development
      const serverUrl =
        process.env.NODE_ENV === 'production'
          ? '' // Leave empty for production, React will assume same origin
          : 'http://localhost:5000';
  
      const response = await fetch(`${serverUrl}/api/openai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch from /api/openai');
      }
  
      const data = await response.json();
      console.log('AI Response:', data.content);
    } catch (error) {
      console.error(error);
    } finally {
      setPrompt('');
      setIsInputVisible(false);
    }
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