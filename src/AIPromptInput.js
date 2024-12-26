import React, { useState } from 'react';
import { FaHatWizard } from "react-icons/fa6";
import './AIPromptInput.css';

function AIPromptInput({ onPromptSubmit }) {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    setIsInputVisible(!isInputVisible);
  };

  const handleInputChange = (e) => {
    if (e.target.value.length <= 400) {
      setPrompt(e.target.value);
    }
  };

  const clearPrompt = () => {
    setPrompt('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const messages = [
        {
          role: 'system',
          content: 'You specialize in generating unique and creative WoW abilities...'
        },
        { role: 'user', content: prompt }
      ];
  
      // Determine the base URL based on environment
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000'
        : '';
      
      const response = await fetch(`${baseUrl}/api/openai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('AI Response:', data.content);
      
      // Call onPromptSubmit with the response data if it exists
      if (onPromptSubmit) {
        onPromptSubmit(JSON.parse(data.content));
      }
  
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className={`ai-prompt-input-container ${isInputVisible ? 'expanded' : ''}`}>
     
      {isInputVisible && (
        <div className="ai-prompt-input-border">
          <div className="prompt-container">
            <textarea
              type="text"
              className='prompt-input'
              value={prompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Example: A druid spell that tosses a sapling to deal damage and slow the targets in AoE"
            />
            <div className="prompt-actions">
            {isLoading && <div className="loading-spinner"></div>}
              
              <button
                className="generate-btn"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Tooltip'}
              </button>
              <span className="char-counter">
                
                <button className="clear-btn" onClick={clearPrompt}>
                  Clear
                </button>
                {prompt.length}/400
              </span>
            </div>
            
          </div>
         
        </div>
      )}
       <button className="magic-button" onClick={handleButtonClick}>
        <span className="beta-label">Beta</span>
        <FaHatWizard className='magic-icon'/>
        <br/>
        Prompt-a-tooltip
      </button>

    </div>
  );
}

export default AIPromptInput;