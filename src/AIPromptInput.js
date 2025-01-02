import React, { useState, useEffect } from 'react';
import { FaHatWizard, FaMagic, FaChevronDown } from "react-icons/fa6";
import './AIPromptInput.css';
import { API_BASE_URL } from './config';

function AIPromptInput({ onPromptSubmit }) {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const loadingMessages = [
    'Tipping blacksmiths...',
    'Waiting in LFD queue...',
    'On flightpath...',
    'Mrrlrgmlrg-ing...',
    'Looting boars...',
    'Resurrecting at spirit healer...',
    'Arguing over loot rolls...',
    'Drinking conjured water...',
    'Standing in fire...',
    'Chasing critters...',
    'Buffing raid members...',
    'Summoning a voidwalker...',
    'Brewing potions...',
    'Dancing on a mailbox...',
    'Sheeping random mobs...',
    'Repairing gear...',
    'Counting coppers...',
    'Polishing heirlooms...',
    'Fishing for Old Ironjaw...',
    'Rolling for loot...'
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setLoadingMessage(loadingMessages[randomIndex]);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Add effect to manage body class
  useEffect(() => {
    if (isInputVisible) {
      document.body.classList.add('prompt-open');
    } else {
      document.body.classList.remove('prompt-open');
    }
    
    // Cleanup
    return () => {
      document.body.classList.remove('prompt-open');
    };
  }, [isInputVisible]);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          content: 'You are an expert game designer specializing in World of Warcraft (WoW) abilities. You understand WoWs mechanics, terminology, and class dynamics. Your task is to design creative, balanced abilities aligned with the gameSs lore. Use only talents, charges, and requirements only when explicitly specified by the user. Default charge is 0 unless it’s 2 or more; never 1.',
        },
        { role: 'user', content: prompt },
      ];
  
      console.log('Messages for AI1:', messages);
  
      // Fetch tooltip data
      const tooltipResponse = await fetch(`${API_BASE_URL}/openai-tooltip`, {
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
      const queryResponse = await fetch(`${API_BASE_URL}/openai-query`, {
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
      const iconResponse = await fetch(`${API_BASE_URL}/find-icon`, {
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
          icon: icons.length > 0 ? icons[0].filename : '',
        };
        console.log('Final Tooltip with Icon:', tooltipWithIcon);
        onPromptSubmit(tooltipWithIcon);
        setIsInputVisible(false);
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

  const renderPromptContent = () => (
    <div className="prompt-container">
      <textarea
        type="text"
        className='prompt-input'
        value={prompt}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Example: A druid spell that tosses a sapling to deal damage and slow the targets in AoE"
        disabled={isLoading}
      />
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <div className={`loading-message ${loadingMessage ? 'visible' : ''}`}>
            {loadingMessage}
          </div>
        </div>
      )}
      <div className="prompt-actions">
        <button
          className={`generate-btn ${isLoading ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Tooltip'}
        </button>
        <span className="char-counter">
          <button className="clear-btn" onClick={clearPrompt} disabled={isLoading}>
            Clear
          </button>
          {prompt.length}/400
        </span>
      </div>
    </div>
  );

  return (
    <>
      <button className="magic-button" onClick={() => setIsInputVisible(!isInputVisible)}>
        <span className="beta-label">Beta</span>
        <FaHatWizard className="magic-icon" />
        <br />
        Prompt-a-tooltip
      </button>

      {isMobile ? (
        <div className={`ai-prompt-input-container ${isInputVisible ? 'expanded' : ''}`}>
          <button className="close-overlay-button" onClick={() => setIsInputVisible(false)}>
            <FaChevronDown />
          </button>
          <div className="ai-prompt-input-border">
            {renderPromptContent()}
          </div>
        </div>
      ) : (
        <div className={`ai-prompt-input ${isInputVisible ? 'expanded' : ''}`}>
          <div className="ai-prompt-input-border">
            {renderPromptContent()}
          </div>
        </div>
      )}
    </>
  );
}

export default AIPromptInput;