import React, { useState, useEffect } from 'react';
import './AttributeField.css';

function AttributeField({ attribute, updateAttribute }) {
  const { label } = attribute;
  const placeholderText = label;
  
  const [value, setValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState(attribute.dropdownValue || '');
  const [timeUnit, setTimeUnit] = useState('sec');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTimeUnitDropdown, setShowTimeUnitDropdown] = useState(false);
  const [unit, setUnit] = useState(attribute.unit || '');
  const [suffix, setSuffix] = useState(attribute.suffix || '');
  const [prefix, setPrefix] = useState(attribute.prefix || '');

  useEffect(() => {
    switch (label) {
      case 'Cooldown':
        setSuffix('cooldown');
        setUnit('sec');
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

  const getTimeUnits = () => ['sec', 'min', 'hr'];

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

  const handleTimeUnitSelect = (selectedUnit) => {
    setTimeUnit(selectedUnit);
    setUnit(selectedUnit);
    setShowTimeUnitDropdown(false);
  };

  useEffect(() => {
    const displayValue = buildDisplayValue();
    updateAttribute({
      ...attribute,
      value,
      dropdownValue,
      unit: label === 'Cooldown' ? timeUnit : unit,
      suffix: label === 'Cooldown' ? dropdownValue : suffix,
      prefix,
      displayValue,
    });
  }, [value, dropdownValue, unit, suffix, prefix, timeUnit]);

  const buildDisplayValue = () => {
    if (label === 'Cast Time' && dropdownValue === 'Instant') {
      return 'Instant';
    }

    const parts = [];
    if (prefix) parts.push(prefix);
    if (value) parts.push(value);
    if ((unit || timeUnit) && value) {
      parts.push(label === 'Cooldown' ? timeUnit : unit);
    }
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
          className={`tooltip-input ${!value ? 'placeholder-text' : ''}`}
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

        {label === 'Cooldown' ? (
          <>
            <div
              className="dropdown-container"
              onMouseEnter={() => setShowTimeUnitDropdown(true)}
              onMouseLeave={() => setShowTimeUnitDropdown(false)}
            >
              <span className={`attribute-dropdown-value ${!timeUnit ? 'default-value' : ''}`}>
                {timeUnit} <span className="dropdown-arrow">▼</span>
              </span>
              {showTimeUnitDropdown && (
                <ul className="dropdown-menu">
                  {getTimeUnits().map((unit, index) => (
                    <li key={index} onClick={() => handleTimeUnitSelect(unit)}>
                      {unit}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          unit && value && <span className="attribute-unit"> {unit}</span>
        )}

        {getOptions().length > 0 && (
          <div
            className="dropdown-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span className={`attribute-dropdown-value ${!dropdownValue ? 'default-value' : ''}`}>
              {dropdownValue || 'Select'} <span className="dropdown-arrow">▼</span>
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

        {suffix && label !== 'Cooldown' && <span className="attribute-suffix"> {suffix}</span>}
      </span>
    </div>
  );
}

export default AttributeField;