// AttributeField.js
import React, { useState, useEffect, useRef } from 'react';
import './AttributeField.css';

function AttributeField({ attribute, updateAttribute }) {
  const { label } = attribute;
  const [inputValue, setInputValue] = useState(attribute.value || '');
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
        return ['Astral Power', 'Energy', 'Focus', 'Fury', 'Maelstrom', 'Mana', 'Rage', 'Runes'];
      case 'Secondary Cost':
        return ['Arcane Charges', 'Chi', 'Combo Points', 'Essence', 'Holy Power', 'Insanity', 'Runic Power', 'Soul Shards'];
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

  // Synchronize contentEditable with state
  useEffect(() => {
    if (inputElementRef.current && inputElementRef.current.innerText !== inputValue) {
      inputElementRef.current.innerText = inputValue;
    }
  }, [inputValue]);

  // Handle changes in the contentEditable div
  const handleInputChange = (e) => {
    setInputValue(e.target.innerText.trim());
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
      value: inputValue,
      dropdownValue: option,
      unit,
      suffix,
      prefix,
      displayValue,
    });
  };

  // Toggle dropdown visibility
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent triggering other click handlers
    setShowDropdown(!showDropdown);
  };

  // Close dropdown and exit edit mode when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Build the display value
  const buildDisplayValue = () => {
    if (label === 'Cast Time' && dropdownValue === 'Instant') {
      return 'Instant';
    }
    let parts = [];

    if (prefix) {
      parts.push(prefix);
    }

    if (inputValue) {
      parts.push(inputValue);
    }

    if (unit && inputValue) {
      parts.push(unit);
    }

    if (dropdownValue && !(label === 'Cast Time' && (dropdownValue === 'Cast' || dropdownValue === 'Channeled'))) {
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
      value: inputValue,
      dropdownValue,
      unit,
      suffix,
      prefix,
      displayValue, // Include the display value here
    });
  }, [inputValue, dropdownValue, unit, suffix, prefix]);

  return (
    <div
      className={`attribute-field ${isEditing ? 'editing' : ''}`}
      onMouseEnter={() => setIsEditing(true)}
      onMouseLeave={() => {
        if (!inputRef.current.contains(document.activeElement)) {
          setIsEditing(false);
        }
      }}
      ref={inputRef}
    >
      <span className="attribute-content">
        {/* Prefix */}
        {prefix && <span className="attribute-prefix">{prefix} </span>}

        {/* Input Value */}
        {(isEditing && (label !== 'Cast Time' || dropdownValue !== 'Instant')) ? (
          <span
            className="attribute-input"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInputChange}
            onFocus={() => setShowDropdown(false)}
            ref={inputElementRef} // Attach the ref here
          >
            {inputValue}
          </span>
        ) : (
          inputValue && <span>{inputValue}</span>
        )}

        {/* Unit */}
        {unit && inputValue && <span className="attribute-unit"> {unit}</span>}

        {/* Dropdown Value */}
        {getOptions().length > 0 && (
          <span
            className="attribute-dropdown-value"
            onClick={toggleDropdown}
          >
            {' '}
            {dropdownValue || 'Select'}
          </span>
        )}

        {/* Suffix */}
        {suffix && <span className="attribute-suffix"> {suffix}</span>}
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
  );
}

export default AttributeField;
