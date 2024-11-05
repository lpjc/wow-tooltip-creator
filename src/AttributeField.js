// AttributeField.js
import React, { useState } from 'react';
import './AttributeField.css';

const AttributeField = ({ attribute, updateAttribute, rightAligned }) => {
  const [focused, setFocused] = useState(false);

  const getFieldComponents = () => {
    switch (attribute.label) {
      case 'Cooldown':
        return (
          <div className={`attribute-field ${rightAligned ? 'right-aligned' : ''}`}>
            <input
              type="text"
              value={attribute.value || ''}
              onChange={(e) => updateAttribute({
                ...attribute,
                value: e.target.value,
                timeUnit: attribute.timeUnit || 'sec',
                type: attribute.type || 'cooldown'
              })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="0"
              className="number-input"
            />
            <select
              value={attribute.timeUnit || 'sec'}
              onChange={(e) => updateAttribute({
                ...attribute,
                timeUnit: e.target.value
              })}
              className="time-unit-select"
            >
              <option value="sec">sec</option>
              <option value="min">min</option>
              <option value="hr">hr</option>
            </select>
            <select
              value={attribute.type || 'cooldown'}
              onChange={(e) => updateAttribute({
                ...attribute,
                type: e.target.value
              })}
              className="cooldown-type-select"
            >
              <option value="cooldown">Cooldown</option>
              <option value="recharge">Recharge</option>
            </select>
          </div>
        );

      case 'Cast Time':
        return (
          <div className="attribute-field">
           
           {attribute.castType !== 'Instant' && attribute.castType !== 'Passive' && (
              <>
                <input
                  type="text"
                  value={attribute.value || ''}
                  onChange={(e) => updateAttribute({
                    ...attribute,
                    value: e.target.value
                  })}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="0"
                  className="number-input"
                />
                <span className="locked-unit">sec</span>
              </>
            )}
             <select
              value={attribute.castType || 'Instant'}
              onChange={(e) => {
                const newCastType = e.target.value;
                updateAttribute({
                  ...attribute,
                  castType: newCastType,
                  // Clear the value if switching to Instant
                  value: (newCastType === 'Instant' || newCastType === 'Passive') ? '' : attribute.value
                });
              }}
              className="cast-type-select"
            >
              <option value="Instant">Instant</option>
              <option value="Cast">Cast</option>
              <option value="Channel">Channel</option>
              <option value="Passive">Passive</option>
            </select>
          </div>
        );

      case 'Cost':
        return (
          <div className="attribute-field">
            <input
              type="text"
              value={attribute.value || ''}
              onChange={(e) => updateAttribute({
                ...attribute,
                value: e.target.value
              })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="0"
              className="number-input"
            />
            <select
              value={attribute.costType || 'Mana'}
              onChange={(e) => updateAttribute({
                ...attribute,
                costType: e.target.value
              })}
              className="resource-type-select"
            >
              {['Astral Power', 'Energy', 'Focus', 'Fury', 'Maelstrom', 'Mana', 'Rage', 'Runes']
                .map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
            </select>
          </div>
        );

      case 'Secondary Cost':
        return (
          <div className="attribute-field">
            <input
              type="text"
              value={attribute.value || ''}
              onChange={(e) => updateAttribute({
                ...attribute,
                value: e.target.value
              })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="0"
              className="number-input"
            />
            <select
              value={attribute.costType || 'Combo Points'}
              onChange={(e) => updateAttribute({
                ...attribute,
                costType: e.target.value
              })}
              className="resource-type-select"
            >
              {['Arcane Charges', 'Chi', 'Combo Points', 'Essence', 'Holy Power', 'Insanity', 'Runic Power', 'Soul Shards']
                .map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
            </select>
          </div>
        );

      case 'Range':
        return (
          <div className="attribute-field">
            <input
              type="text"
              value={attribute.value || ''}
              onChange={(e) => updateAttribute({
                ...attribute,
                value: e.target.value
              })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="0"
              className="number-input"
            />
            <span className="locked-unit">yards</span>
          </div>
        );

      case 'Requirements':
        return (
          <div className="attribute-field">
            <span className="locked-prefix">Requires </span>
            <input
              type="text"
              value={attribute.value || ''}
              onChange={(e) => updateAttribute({
                ...attribute,
                value: e.target.value
              })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="requirement"
              className="text-input"
            />
          </div>
        );

      case 'Talent':
        return (
          <div className="attribute-field talent">
            <span className="locked-text">Talent</span>
          </div>
        );

      case 'Charges':
        return (
          <div className="attribute-field">
            <input
              type="text"
              value={attribute.value || ''}
              onChange={(e) => updateAttribute({
                ...attribute,
                value: e.target.value
              })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="0"
              className="number-input"
            />
            <span className="locked-unit">charges</span>
          </div>
        );

      default:
        return null;
    }
  };

  return getFieldComponents();
};

export default AttributeField;