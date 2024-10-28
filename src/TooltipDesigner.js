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
    const { name, value, type, checked } = e.target;
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
      setFormData({ ...formData, [name]: checked });
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
    return (
      <>
        {/* Always visible fields */}
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <IconSelector
          iconList={iconList}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />

        <div className="input-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        {/* Cooldown and Cast Time */}
        <div className="input-group-row">
          <div className="input-group">
            <label>Cooldown</label>
            <input
              type="text"
              name="cooldown"
              value={formData.cooldown || ''}
              onChange={handleInputChange}
            />
          </div>

          {/* Cast Time (oneOf) */}
          <div className="input-group">
            <label>Cast Time</label>
            <select
              name="castTime"
              value={formData.castTime.type || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  castTime: { type: e.target.value },
                })
              }
            >
              <option value="">Select Cast Time</option>
              {schema.properties.castTime.oneOf &&
                schema.properties.castTime.oneOf.map((option, idx) => (
                  option.enum ? (
                    <option key={idx} value={option.enum[0]}>
                      {option.enum[0]}
                    </option>
                  ) : null
                ))}
            </select>
          </div>
        </div>

        {/* Cost, Charges, and Range */}
        <div className="input-group-row">
          <div className="input-group">
            <label>Resource Type</label>
            <select
              name="cost"
              data-subname="resourceType"
              value={formData.cost.resourceType || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Resource Type</option>
              {schema.properties.cost?.properties?.resourceType?.enum?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Resource Amount</label>
            <input
              type="number"
              name="cost"
              data-subname="resourceAmount"
              value={formData.cost.resourceAmount || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="input-group-row">
          <div className="input-group">
            <label>Charges</label>
            <input
              type="number"
              name="charges"
              value={formData.charges || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group">
            <label>Range</label>
            <input
              type="text"
              name="range"
              value={formData.range || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Talent Indicator */}
        <div className="input-group">
          <label>
            <input
              type="checkbox"
              name="talentIndicator"
              checked={formData.talentIndicator || false}
              onChange={handleInputChange}
            />
            Is this a Talent?
          </label>
        </div>

        {/* Requirements checkbox */}
        <div className="input-group">
          <label>
            <input
              type="checkbox"
              name="requirementsCheckbox"
              checked={formData.requirementsCheckbox || false}
              onChange={(e) =>
                setFormData({ ...formData, requirementsCheckbox: e.target.checked })
              }
            />
            Is there any requirements?
          </label>
        </div>

        {/* Show Stance and Weapon only if requirementsCheckbox is checked */}
        {formData.requirementsCheckbox && (
          <div className="input-group">
            <div className="input-group">
              <label>Stance</label>
              <input
                type="text"
                name="requirements"
                data-subname="stance"
                value={formData.requirements.stance || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>Weapon</label>
              <input
                type="text"
                name="requirements"
                data-subname="weapon"
                value={formData.requirements.weapon || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="tooltip-designer-container">
      {/* Input Section */}
      <div className="input-section">
        <h2>Create Tooltip</h2>

        {renderInputFields()}

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
