// TooltipDesigner.js
import React, { useState, useEffect } from 'react';
import IconSelector from './IconSelector';
import AddAttributeButton from './AddAttributeButton';
import CurrentTooltip from './CurrentTooltip';
import AIPromptInput from './AIPromptInput';
import './TooltipDesigner.css';

function TooltipDesigner({ onSave, initialTooltipData }) {
  const [tooltipData, setTooltipData] = useState({
    icon: '',
    name: 'Name',
    description: 'Description',
    attributes: [],
  });

  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  useEffect(() => {
    if (initialTooltipData) {
      // Transform the attributes to include their values and types
      const transformedAttributes = initialTooltipData.attributes.map(attr => {
        // Parse the displayValue if it exists to get individual components
        let value = attr.value || '';
        let timeUnit = 'sec';
        let type = '';
        let castType = 'Cast';
        let costType = 'Mana';

        if (attr.displayValue) {
          switch (attr.label) {
            case 'Cooldown':
              const cooldownParts = attr.displayValue.split(' ');
              value = cooldownParts[0];
              timeUnit = cooldownParts[1];
              type = cooldownParts[2];
              break;
            case 'Cast Time':
              if (attr.displayValue === 'Instant') {
                castType = 'Instant';
              } else {
                const castParts = attr.displayValue.split(' ');
                value = castParts[0];
                castType = castParts[2];
              }
              break;
            case 'Cost':
            case 'Secondary Cost':
              const costParts = attr.displayValue.split(' ');
              value = costParts[0];
              costType = costParts.slice(1).join(' ');
              break;
            case 'Range':
              value = attr.displayValue.split(' ')[0];
              break;
            case 'Requirements':
              value = attr.displayValue.replace('Requires ', '');
              break;
            case 'Charges':
              value = attr.displayValue.split(' ')[0];
              break;
            default:
              break;
          }
        }

        return {
          label: attr.label,
          value,
          timeUnit,
          type,
          castType,
          costType,
        };
      });

      setTooltipData({
        icon: initialTooltipData.icon || '',
        name: initialTooltipData.name || 'Name',
        description: initialTooltipData.description || 'Description',
        attributes: transformedAttributes,
      });
    }
  }, [initialTooltipData]);

  const handleEditField = (field, value) => {
    if (field === 'attributes') {
      setTooltipData({ ...tooltipData, attributes: value });
    } else {
      setTooltipData({ ...tooltipData, [field]: value });
    }
  };

  const handleToggleAttribute = (attributeLabel) => {
    const existingAttributeIndex = tooltipData.attributes.findIndex(
      (attr) => attr.label === attributeLabel
    );

    if (existingAttributeIndex > -1) {
      // Remove the attribute
      const updatedAttributes = [...tooltipData.attributes];
      updatedAttributes.splice(existingAttributeIndex, 1);
      setTooltipData({ ...tooltipData, attributes: updatedAttributes });
    } else {
      // Add the attribute with appropriate default values
      let newAttribute = { label: attributeLabel };

      switch (attributeLabel) {
        case 'Cooldown':
          newAttribute = {
            ...newAttribute, 
            value: '',
            timeUnit: 'sec',
            type: 'cooldown'
          };
          break;
        case 'Cast Time':
          newAttribute = {
            ...newAttribute,
            value: '',
            castType: 'Instant'
          };
          break;
        case 'Cost':
          newAttribute = {
            ...newAttribute,
            value: '',
            costType: 'Mana'
          };
          break;
        case 'Secondary Cost':
          newAttribute = {
            ...newAttribute,
            value: '',
            costType: 'Combo Points'
          };
          break;
        case 'Range':
          newAttribute = {
            ...newAttribute,
            value: ''
          };
          break;
        case 'Requirements':
          newAttribute = {
            ...newAttribute,
            value: ''
          };
          break;
        case 'Talent':
          newAttribute = {
            ...newAttribute,
            value: 'Talent'
          };
          break;
        case 'Charges':
          newAttribute = {
            ...newAttribute,
            value: ''
          };
          break;
        default:
          break;
      }

      setTooltipData({
        ...tooltipData,
        attributes: [...tooltipData.attributes, newAttribute],
      });
    }
  };

  const handleSave = () => {
    // Transform attributes to include displayValue
    const transformedData = {
      ...tooltipData,
      attributes: tooltipData.attributes.map(attr => {
        let displayValue = attr.value;
        
        switch (attr.label) {
          case 'Cooldown':
            displayValue = `${attr.value} ${attr.timeUnit} ${attr.type}`;
            break;
            case 'Cast Time':
              displayValue = attr.castType === 'Instant' 
                  ? 'Instant'
                  : attr.castType === 'Passive'
                      ? 'Passive'
                      : `${attr.value} sec ${attr.castType}`;
              break;
          case 'Cost':
          case 'Secondary Cost':
            displayValue = `${attr.value} ${attr.costType}`;
            break;
          case 'Range':
            displayValue = `${attr.value} yards`;
            break;
          case 'Requirements':
            displayValue = `Requires ${attr.value}`;
            break;
          case 'Charges':
            displayValue = `${attr.value} charges`;
            break;
          default:
            break;
        }
        
        return {
          ...attr,
          displayValue
        };
      })
    };
    
    onSave(transformedData);
  };

  const handleClear = () => {
    setTooltipData({
      icon: '',
      name: 'Name',
      description: 'Description',
      attributes: [],
    });
  };

  const handlePromptSubmit = (promptResponse) => {
    // Start with base tooltip data
    const newTooltipData = {
      name: promptResponse.name,
      description: promptResponse.description,
      icon: promptResponse.icon,
      attributes: []
    };
  
    // Map AI response fields to attributes
    if (promptResponse.cooldown) {
      newTooltipData.attributes.push({
        label: 'Cooldown',
        value: promptResponse.cooldown.value,
        timeUnit: promptResponse.cooldown.timeUnit,
        type: promptResponse.cooldown.type
      });
    }
  
    if (promptResponse.castTime) {
      newTooltipData.attributes.push({
        label: 'Cast Time',
        value: promptResponse.castTime.value,
        castType: promptResponse.castTime.castType
      });
    }
  
    if (promptResponse.cost) {
      newTooltipData.attributes.push({
        label: 'Cost',
        value: promptResponse.cost.value,
        costType: promptResponse.cost.costType
      });
    }
  
    if (promptResponse.secondaryCost) {
      newTooltipData.attributes.push({
        label: 'Secondary Cost',
        value: promptResponse.secondaryCost.value,
        costType: promptResponse.secondaryCost.costType
      });
    }
  
    if (promptResponse.range) {
      newTooltipData.attributes.push({
        label: 'Range',
        value: promptResponse.range.value
      });
    }
  
    if (promptResponse.requirements) {
      newTooltipData.attributes.push({
        label: 'Requirements',
        value: promptResponse.requirements.value
      });
    }
  
    if (promptResponse.talent) {
      newTooltipData.attributes.push({
        label: 'Talent',
        value: 'Talent'
      });
    }
  
    if (promptResponse.charges) {
      newTooltipData.attributes.push({
        label: 'Charges',
        value: promptResponse.charges.value
      });
    }
  
    // Single state update
    setTooltipData(newTooltipData);
  };

  return (
    <div className="tooltip-designer-container">
      <div className="main-container">
        <div className="tooltip-preview-container">
          <div className="preview-section">
            <CurrentTooltip
              tooltipData={tooltipData}
              onEditField={handleEditField}
              onIconClick={() => setIsIconSelectorOpen(true)}
            />
          </div>
          
          <div className="action-buttons">
            <button onClick={handleSave} className="save-button">
              Save
            </button>
            <button onClick={handleClear} className="clear-button">
              Clear
            </button>
          </div>
        </div>

        <div className="add-attribute-section">
          <AddAttributeButton
            attributes={tooltipData.attributes}
            onToggleAttribute={handleToggleAttribute}
          />
        </div>
      </div>

      <AIPromptInput onPromptSubmit={handlePromptSubmit} />

      {isIconSelectorOpen && (
        <IconSelector
          onSelect={(icon) => {
            handleEditField('icon', icon);
            setIsIconSelectorOpen(false);
          }}
          onClose={() => setIsIconSelectorOpen(false)}
        />
      )}
    </div>
  );
}

export default TooltipDesigner;