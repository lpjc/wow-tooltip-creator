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
    console.log('HandleSubmit triggered with prompt:', prompt);
  
    try {
      // Step 1: Tooltip Generation via AI1
      const messages = [
        {
          role: 'system',
          content: 'You are an expert game designer specializing in World of Warcraft (WoW) abilities. You understand WoWs mechanics, terminology, and class dynamics. Your task is to design creative, balanced abilities aligned with the gameSs lore. Use talents, charges, and requirements only when explicitly specified by the user. Default charge is 0 unless it’s 2 or more; never 1.',
        },
        { role: 'user', content: prompt },
      ];
  
      console.log('Messages for AI1:', messages);
  
      // Determine the base URL based on environment
      const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : '';
      console.log('Base URL:', baseUrl);
  
      // Fetch tooltip data
      const tooltipResponse = await fetch(`${baseUrl}/api/openai-tooltip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
  
      console.log('Tooltip response status:', tooltipResponse.status);
  
      if (!tooltipResponse.ok) {
        console.error('Tooltip API Error:', await tooltipResponse.text());
        throw new Error(`HTTP error! status: ${tooltipResponse.status}`);
      }
  
      const tooltipData = await tooltipResponse.json();
      console.log('Raw Tooltip Data:', tooltipData);
  
      if (!tooltipData || !tooltipData.content) {
        console.error('Tooltip API returned invalid data:', tooltipData);
        throw new Error('Tooltip data is missing or invalid.');
      }
  
      const parsedTooltip = JSON.parse(tooltipData.content); // Ensure valid JSON content
      console.log('Parsed Tooltip:', parsedTooltip);
  
      // Step 2: Generate Query via AI2
      console.log('Sending Tooltip Data to AI2 for Query Generation...');
      const queryResponse = await fetch(`${baseUrl}/api/openai-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          attributes: {
            name: parsedTooltip.name,
            description: parsedTooltip.description,
          },
        }),
      });
  
      console.log('Query response status:', queryResponse.status);
  
      if (!queryResponse.ok) {
        console.error('Query API Error:', await queryResponse.text());
        throw new Error(`HTTP error! status: ${queryResponse.status}`);
      }
  
      const queryData = await queryResponse.json();
      console.log('Raw Query Data:', queryData);
  
      // Update validation check
      if (!queryData || !queryData.colors) {
        console.error('Query API returned invalid data:', queryData);
        throw new Error('Query data is missing or invalid.');
      }
  
      // Step 3: Fetch Matching Icons from Supabase
      console.log('Fetching Icons with colors:', queryData.colors);
      const iconResponse = await fetch(`${baseUrl}/api/find-icon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          colors: queryData.colors,
          spellDescription: parsedTooltip.description // Add spell description
        }),
      });
  
      console.log('Icon response status:', iconResponse.status);
  
      if (!iconResponse.ok) {
        console.error('Icon API Error:', await iconResponse.text());
        throw new Error(`HTTP error! status: ${iconResponse.status}`);
      }
  
      const { icons } = await iconResponse.json();
      console.log('Supabase Icon Response:', icons);
  
      if (!icons || !Array.isArray(icons)) {
        console.error('Icon API returned invalid data:', icons);
        throw new Error('Icons data is missing or invalid.');
      }
  
      // Step 4: Pass Final Data to `onPromptSubmit`
      console.log('Finalizing Tooltip Data...');
      if (onPromptSubmit) {
        const tooltipWithIcon = {
          ...parsedTooltip,
          icon: icons.length > 0 ? icons[0].filename : '', // Assign first matching icon or leave empty
        };
        console.log('Final Tooltip with Icon:', tooltipWithIcon);
        onPromptSubmit(tooltipWithIcon);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      console.log('HandleSubmit complete. Cleaning up...');
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