// AttributeField.js
import React, { useState, useEffect, useRef } from 'react';
import './AttributeField.css';

function AttributeField({ attribute, updateAttribute }) {
  const { label } = attribute;
  const placeholder = attribute.placeholder || ''; // Use a placeholder if provided
  const [inputValue, setInputValue] = useState(attribute.value || placeholder);
  const [dropdownValue, setDropdownValue] = useState(attribute.dropdownValue || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [unit, setUnit] = useState(attribute.unit || '');
  const [suffix, setSuffix] = useState(attribute.suffix || '');
  const [prefix, setPrefix] = useState(attribute.prefix || '');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const inputElementRef = useRef(null);

  // Define options based on attribute label
  const getOptions = () => {
    switch (label) {
      case 'Cooldown':
        return ['sec', 'min', 'hr'];
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

  // Handle changes in the contentEditable div
  const handleInputChange = (e) => {
    setInputValue(e.target.innerText);
  };

  // Clear placeholder on focus
  const handleInputFocus = () => {
    setShowDropdown(false);
    if (inputValue === placeholder) {
      setInputValue('');
      // Clear the contentEditable element's content
      if (inputElementRef.current) {
        inputElementRef.current.innerText = '';
      }
    }
  };

  // Restore placeholder on blur if input is empty
  const handleInputBlur = () => {
    if (inputValue.trim() === '') {
      setInputValue(placeholder);
      // Set the contentEditable element's content to placeholder
      if (inputElementRef.current) {
        inputElementRef.current.innerText = placeholder;
      }
    }
  };

  // Handle key down events
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Remove focus from the input
      if (inputElementRef.current) {
        inputElementRef.current.blur();
      }
    }
  };

  // Handle dropdown selection
  const handleDropdownSelect = (option) => {
    setDropdownValue(option);
    setShowDropdown(false);

    if (label === 'Cast Time') {
      if (option === 'Instant') {
        // If "Instant" is selected, clear input value and unit
        setInputValue('');
        setUnit('');
      } else {
        setUnit('sec');
      }
    }

    // Update the attribute in the parent component
    const displayValue = buildDisplayValue();
    updateAttribute({
      ...attribute,
      value: inputValue === placeholder ? '' : inputValue,
      dropdownValue: option,
      unit,
      suffix,
      prefix,
      displayValue,
    });
  };

  // Build the display value
  const buildDisplayValue = () => {
    if (label === 'Cast Time' && dropdownValue === 'Instant') {
      return 'Instant';
    }
    let parts = [];

    if (prefix) {
      parts.push(prefix);
    }

    if (inputValue && inputValue !== placeholder) {
      parts.push(inputValue);
    }

    if (unit && inputValue && inputValue !== placeholder) {
      parts.push(unit);
    }

    if (
      dropdownValue &&
      !(label === 'Cast Time' && (dropdownValue === 'Cast' || dropdownValue === 'Channeled'))
    ) {
      parts.push(dropdownValue);
    }

    if (suffix) {
      parts.push(suffix);
    }

    return parts.join(' ');
  };

  // Update the attribute whenever relevant state changes
  useEffect(() => {
    const displayValue = buildDisplayValue();
    updateAttribute({
      ...attribute,
      value: inputValue === placeholder ? '' : inputValue,
      dropdownValue,
      unit,
      suffix,
      prefix,
      displayValue,
    });
  }, [inputValue, dropdownValue, unit, suffix, prefix]);

  // Handle dropdown visibility on hover
  const handleDropdownMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    setShowDropdown(false);
  };

  // Close dropdown and exit edit mode when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsEditing(false);
        handleInputBlur();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef]);

  return (
    <div
      className={`attribute-field`}
      onMouseEnter={() => setIsEditing(true)}
      onMouseLeave={() => {
        if (!inputRef.current.contains(document.activeElement)) {
          setIsEditing(false);
          handleInputBlur();
        }
      }}
      ref={inputRef}
    >
      <span className="attribute-content">
        {/* Prefix */}
        {prefix && <span className="attribute-prefix">{prefix} </span>}

        {/* Input Value */}
        {isEditing && (label !== 'Cast Time' || dropdownValue !== 'Instant') ? (
          <span
            className={`attribute-input ${inputValue === placeholder ? 'default-value' : ''}`}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            ref={inputElementRef}
          >
            {inputValue === placeholder ? '' : inputValue}
          </span>
        ) : (
          inputValue && (
            <span className={`${inputValue === placeholder ? 'default-value' : ''}`}>
              {inputValue}
            </span>
          )
        )}

        {/* Unit */}
        {unit && inputValue && inputValue !== placeholder && (
          <span className="attribute-unit"> {unit}</span>
        )}

        {/* Dropdown Value */}
        {getOptions().length > 0 && (
          <div
            className="dropdown-container"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <span
              className={`attribute-dropdown-value ${showDropdown ? 'active' : ''} ${
                !dropdownValue ? 'default-value' : ''
              }`}
            >
              {' '}
              {dropdownValue || 'Select'}
            </span>
            {/* Dropdown */}
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

        {/* Suffix */}
        {suffix && <span className="attribute-suffix"> {suffix}</span>}
      </span>
    </div>
  );
}

export default AttributeField;
