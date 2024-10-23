import React from 'react';
import './TooltipPreview.css';

function TooltipPreview({ tooltip }) {
  if (!tooltip) {
    return null;
  }

  // Destructure tooltip data from the schema
  const {
    icon,
    name,
    description,
    requirements = {},
    charges,
    cost = {},
    range,
    castTime = {},
    cooldown,
    talentIndicator,
  } = tooltip;

  // Fallback for missing icon
  const tooltipIcon = icon
    ? `/icons/${icon}`
    : 'https://db.ascension.gg/static/images/wow/icons/large/inv_misc_questionmark.jpg';

  // Determine cast time display
  let castTimeDisplay = '';
  if (typeof castTime === 'string') {
    castTimeDisplay = castTime;
  } else if (castTime.type === 'Channeled') {
    castTimeDisplay = `Channeled (${castTime.duration})`;
  } else if (castTime.type === 'Cast Time') {
    castTimeDisplay = `${castTime.seconds} sec cast`;
  }

  // Cost display
  const costDisplay =
    cost.resourceType && cost.resourceAmount
      ? `${cost.resourceAmount} ${cost.resourceType}`
      : '';

  // Requirements display
  const requirementsDisplay = [];
  if (requirements.weapon) {
    requirementsDisplay.push(`Requires ${requirements.weapon}`);
  }
  if (requirements.stance) {
    requirementsDisplay.push(`Requires ${requirements.stance}`);
  }

  // Charges display
  const chargesDisplay = charges ? `${charges} Charges` : '';

  return (
    <div className="tooltip-preview-container">
      {/* Icon Section */}
      <div id="ic81265" style={{ float: 'left' }}>
        <div className="iconlarge">
          <ins
            id="preview-enchant-icon"
            style={{ backgroundImage: `url('${tooltipIcon}')` }}
          ></ins>
          <del>
            <div className="iconlarge-backdrop"></div>
          </del>
        </div>
      </div>

      {/* Tooltip Content */}
      <div
        id="tt81265"
        className="wowhead-tooltip"
        style={{
          float: 'left',
          paddingTop: '1px',
          width: '480px',
          visibility: 'visible',
        }}
      >
        <table>
          <tbody>
            <tr>
              <td className="preview-tooltip">
                <table style={{ whiteSpace: 'nowrap', width: '100%' }}>
                  <tbody>
                    <tr>
                      <td>
                        <table width="100%">
                          <tbody>
                            <tr>
                              <td>
                                <b id="preview-enchant-name">{name}</b>
                              </td>
                              {talentIndicator && (
                                <th>
                                  <b id="preview-enchant-talent" className="q0">
                                    Talent
                                  </b>
                                </th>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td>
                        <span>
                          {/* Requirements */}
                          {requirementsDisplay.length > 0 && (
                            <div id="preview-enchant-requirements">
                              {requirementsDisplay.map((req, idx) => (
                                <span
                                  key={idx}
                                  id={`preview-enchant-requirement${idx + 1}`}
                                  style={{ color: '#f66b6b' }}
                                >
                                  {req}
                                  <br />
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Charges */}
                          {chargesDisplay && (
                            <span className="q0">{chargesDisplay}</span>
                          )}
                          {/* Ability Details */}
                          <span id="ability-details">
                            {/* Cost, Range, Cast Time, Cooldown */}
                            <table className="ability-stats">
                              <tbody>
                                <tr>
                                  {costDisplay && <td>{costDisplay}</td>}
                                  {range && <td>{range}</td>}
                                  {castTimeDisplay && <td>{castTimeDisplay}</td>}
                                  {cooldown && <td>{cooldown} cooldown</td>}
                                </tr>
                              </tbody>
                            </table>
                          </span>
                          {/* Description */}
                          <span className="q" id="preview-enchant-description">
                            {description}
                          </span>
                          <br />
                          <br />
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <th style={{ backgroundPosition: 'top right' }}></th>
            </tr>
            <tr>
              <th style={{ backgroundPosition: 'bottom left' }}></th>
              <th style={{ backgroundPosition: 'bottom right' }}></th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TooltipPreview;
