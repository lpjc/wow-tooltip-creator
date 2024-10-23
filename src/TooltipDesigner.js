import React, { useState, useEffect } from 'react';
import schema from './schema/schema.json'; // Import the schema
import IconSelector from './IconSelector'; // Import IconSelector
import TooltipPreview from './TooltipPreview'; // Import TooltipPreview
import './TooltipDesigner.css';

function TooltipDesigner() {
  const [selectedIcon, setSelectedIcon] = useState('');
  const [iconList, setIconList] = useState([]);
  const [tooltipData, setTooltipData] = useState([]);

  // Initialize formData based on schema properties
  const initialFormData = {};
  Object.keys(schema.properties).forEach((key) => {
    if (schema.properties[key].type === 'object' || schema.properties[key].oneOf) {
      initialFormData[key] = {};
    } else {
      initialFormData[key] = '';
    }
  });
  const [formData, setFormData] = useState(initialFormData);

  // Fetch icons from icons.json
  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch('/icons.json');
        const icons = await response.json();
        setIconList(icons);
      } catch (error) {
        console.error('Error fetching icons:', error);
      }
    };
    fetchIcons();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const property = schema.properties[name];

    // Handle nested objects (cost, castTime, requirements)
    if (property.type === 'object' || property.oneOf) {
      setFormData({
        ...formData,
        [name]: { ...formData[name], [e.target.dataset.subname]: value },
      });
    } else if (property.type === 'integer') {
      setFormData({ ...formData, [name]: parseInt(value) || '' });
    } else if (property.type === 'boolean') {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission to generate tooltip (does not clear formData)
  const handleGenerate = () => {
    const newTooltip = { ...formData, icon: selectedIcon };
    setTooltipData([newTooltip, ...tooltipData]);
  };

  // Handle Edit
  const handleEdit = (tooltip) => {
    const { icon, ...rest } = tooltip;
    setFormData(rest);
    setSelectedIcon(icon);
  };

  // Render input fields dynamically based on schema
  const renderInputFields = () => {
    const smallFields = ['cooldown', 'range', 'charges'];

    const fieldElements = Object.keys(schema.properties).map((key) => {
      if (key === 'icon') {
        // Icon is handled separately
        return null;
      }

      const property = schema.properties[key];
      const label = property.description || key;

      if (property.oneOf) {
        // Handle 'castTime'
        return (
          <div className="input-group" key={key}>
            <label>{label}</label>
            <select
              name={key}
              value={formData[key].type || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [key]: { type: e.target.value },
                })
              }
            >
              <option value="">Select Cast Time</option>
              {property.oneOf.map((option, idx) => {
                if (option.type === 'string') {
                  return (
                    <option key={idx} value={option.enum[0]}>
                      {option.enum[0]}
                    </option>
                  );
                } else if (option.properties.type.const) {
                  return (
                    <option key={idx} value={option.properties.type.const}>
                      {option.properties.type.const}
                    </option>
                  );
                } else {
                  return null;
                }
              })}
            </select>
            {/* Additional fields based on selection */}
            {formData[key].type === 'Channeled' && (
              <div className="input-group">
                <label>Duration (sec):</label>
                <input
                  type="text"
                  name={key}
                  data-subname="duration"
                  value={formData[key].duration || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {formData[key].type === 'Cast Time' && (
              <div className="input-group">
                <label>Cast Time (sec):</label>
                <input
                  type="number"
                  name={key}
                  data-subname="seconds"
                  value={formData[key].seconds || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        );
      } else if (property.type === 'object') {
        // Handle 'cost' and 'requirements'
        if (key === 'cost') {
          return (
            <div className="input-group-row" key={key}>
              <div className="input-group small">
                <label>Resource Type</label>
                <select
                  name={key}
                  data-subname="resourceType"
                  value={formData[key].resourceType || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select Resource Type</option>
                  {property.properties.resourceType.enum.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group small">
                <label>Resource Amount</label>
                <input
                  type="number"
                  name={key}
                  data-subname="resourceAmount"
                  value={formData[key].resourceAmount || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          );
        } else if (key === 'requirements') {
          return (
            <div className="input-group" key={key}>
              <label>{label}</label>
              <div className="input-group">
                <label>Weapon</label>
                <input
                  type="text"
                  name={key}
                  data-subname="weapon"
                  value={formData[key].weapon || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Stance</label>
                <input
                  type="text"
                  name={key}
                  data-subname="stance"
                  value={formData[key].stance || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          );
        }
      } else if (property.enum) {
        // Enum property, render as dropdown
        return (
          <div className="input-group" key={key}>
            <label>{label}</label>
            <select name={key} value={formData[key]} onChange={handleInputChange}>
              <option value="">{`Select ${label}`}</option>
              {property.enum.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (property.type === 'string') {
        // String property, render as text input
        return (
          <div className="input-group" key={key}>
            <label>{label}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleInputChange}
            />
          </div>
        );
      } else if (property.type === 'integer') {
        // Integer property, render as number input
        return (
          <div className="input-group" key={key}>
            <label>{label}</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleInputChange}
            />
          </div>
        );
      } else if (property.type === 'boolean') {
        // Boolean property, render as checkbox
        return (
          <div className="input-group" key={key}>
            <label>
              <input
                type="checkbox"
                name={key}
                checked={formData[key] || false}
                onChange={handleInputChange}
              />
              {label}
            </label>
          </div>
        );
      } else {
        return null;
      }
    });

    // Group small fields into pairs
    const groupedFields = [];
    let i = 0;
    while (i < fieldElements.length) {
      const key = Object.keys(schema.properties)[i];
      const element = fieldElements[i];

      if (smallFields.includes(key) && element) {
        const nextKey = Object.keys(schema.properties)[i + 1];
        const nextElement = fieldElements[i + 1];

        if (smallFields.includes(nextKey) && nextElement) {
          groupedFields.push(
            <div className="input-group-row" key={`group-${i}`}>
              {element}
              {nextElement}
            </div>
          );
          i += 2; // Skip the next field as it's already grouped
        } else {
          groupedFields.push(
            <div className="input-group-row" key={`group-${i}`}>
              {element}
            </div>
          );
          i++;
        }
      } else if (element) {
        groupedFields.push(element);
        i++;
      } else {
        i++;
      }
    }

    return groupedFields;
  };

  return (
    <div className="tooltip-designer-container">
      {/* Input Section */}
      <div className="input-section">
        <h2>Create Tooltip</h2>

        {renderInputFields()}

        {/* Icon Selection */}
        <IconSelector
          iconList={iconList}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />

        <button
          onClick={handleGenerate}
          disabled={!formData.name || !selectedIcon || !formData.description}
        >
          Generate Tooltip
        </button>
      </div>

      {/* Output Section */}
      <div className="output-section">
        <h2>Generated Tooltips</h2>
        <div className="tooltip-list">
          {tooltipData.map((tooltip, index) => (
            <div
              key={index}
              className={`tooltip-item ${index === 0 ? 'current' : ''}`}
            >
              <div className="tooltip-icons">
                <button onClick={() => handleEdit(tooltip)}>Edit</button>
                <button>Share</button>
                <button>Download</button>
              </div>
              <TooltipPreview tooltip={tooltip} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TooltipDesigner;
