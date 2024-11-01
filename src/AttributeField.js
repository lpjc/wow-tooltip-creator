import React, { useState, useEffect } from 'react';
import './AttributeField.css';

function AttributeField({ attribute, updateAttribute }) {
  const { label } = attribute;
  const placeholderText = `Click to edit ${label.toLowerCase()}`;
  
  const [value, setValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState(attribute.dropdownValue || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [unit, setUnit] = useState(attribute.unit || '');
  const [suffix, setSuffix] = useState(attribute.suffix || '');
  const [prefix, setPrefix] = useState(attribute.prefix || '');

  // Set default prefixes, suffixes, and units based on the attribute
  useEffect(() => {
    switch (label) {
      case 'Cooldown':
        setSuffix('cooldown');
        break;
      case 'Cast Time':
        setUnit('sec');
        break;
      case 'Range':
        setUnit('yards');
        break;
      case 'Requirements':
        setPrefix('Requires');
        break;
      default:
        setPrefix('');
        setSuffix('');
        setUnit('');
        break;
    }
  }, [label]);

  // Define options based on attribute label
  const getOptions = () => {
    switch (label) {
      case 'Cooldown':
        return ['cooldown', 'recharge'];
      case 'Cast Time':
        return ['Cast', 'Channeled', 'Instant'];
      case 'Cost':
        return [
          'Astral Power',
          'Energy',
          'Focus',
          'Fury',
          'Maelstrom',
          'Mana',
          'Rage',
          'Runes',
        ];
      case 'Secondary Cost':
        return [
          'Arcane Charges',
          'Chi',
          'Combo Points',
          'Essence',
          'Holy Power',
          'Insanity',
          'Runic Power',
          'Soul Shards',
        ];
      default:
        return [];
    }
  };

  const handleDropdownSelect = (option) => {
    setDropdownValue(option);
    setShowDropdown(false);

    if (label === 'Cast Time') {
      if (option === 'Instant') {
        setValue('');
        setUnit('');
      } else {
        setUnit('sec');
      }
    }

    if (label === 'Cooldown') {
      setSuffix(option);
    }
  };

  // Update parent whenever our values change
  useEffect(() => {
    const displayValue = buildDisplayValue();
    updateAttribute({
      ...attribute,
      value,
      dropdownValue,
      unit,
      suffix: label === 'Cooldown' ? dropdownValue : suffix,
      prefix,
      displayValue,
    });
  }, [value, dropdownValue, unit, suffix, prefix]);

  const buildDisplayValue = () => {
    if (label === 'Cast Time' && dropdownValue === 'Instant') {
      return 'Instant';
    }

    const parts = [];
    if (prefix) parts.push(prefix);
    if (value) parts.push(value);
    if (unit && value) parts.push(unit);
    if (dropdownValue && 
        !(label === 'Cast Time' && 
          (dropdownValue === 'Cast' || dropdownValue === 'Channeled'))) {
      parts.push(dropdownValue);
    }
    if (suffix && label !== 'Cooldown') parts.push(suffix);
    return parts.join(' ');
  };

  return (
    <div className="attribute-field">
      <span className="attribute-content">
        {prefix && <span className="attribute-prefix">{prefix} </span>}

        <div
          className="tooltip-input"
          contentEditable
          suppressContentEditableWarning
          onFocus={(e) => {
            if (!value) {
              e.target.textContent = '';
            }
          }}
          onBlur={(e) => {
            const newValue = e.target.textContent.trim();
            setValue(newValue);
            if (!newValue) {
              e.target.textContent = placeholderText;
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.target.blur();
            }
          }}
        >
          {value || placeholderText}
        </div>

        {unit && value && <span className="attribute-unit"> {unit}</span>}

        {getOptions().length > 0 && (
          <div
            className="dropdown-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span className={`attribute-dropdown-value ${!dropdownValue ? 'default-value' : ''}`}>
              {' '}
              {dropdownValue || 'Select'}
            </span>
            {showDropdown && (
              <ul className="dropdown-menu">
                {getOptions().map((option, index) => (
                  <li key={index} onClick={() => handleDropdownSelect(option)}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {suffix && <span className="attribute-suffix"> {suffix}</span>}
      </span>
    </div>
  );
}

export default AttributeField;