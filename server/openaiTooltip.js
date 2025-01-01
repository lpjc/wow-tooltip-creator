const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  console.log('openaiTooltipHandler triggered');
  console.log('Request body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'ability',
          strict: false,
          schema: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The display name of the ability.',
              },
              description: {
                type: 'string',
                description: 'A concise explanation of what the ability does.',
              },
              icon: {
                type: 'string',
                description: 'A reference or URL to the icon image.',
              },
              cooldown: {
                type: 'object',
                description:
                  'Cooldown field (UI uses a numeric value, time unit [sec/min/hr], and a type [cooldown/recharge]).',
                properties: {
                  value: {
                    type: 'number',
                    description: 'Numeric amount for the cooldown or recharge time.',
                  },
                  timeUnit: {
                    type: 'string',
                    enum: ['sec', 'min', 'hr'],
                    description: 'Time unit for the numeric value.',
                  },
                  type: {
                    type: 'string',
                    enum: ['cooldown', 'recharge'],
                    description: 'Whether this is a traditional cooldown or a recharge mechanic.',
                  },
                },
                required: ['value', 'timeUnit', 'type'],
                additionalProperties: false,
              },
              castTime: {
                type: 'object',
                description: 'Cast Time field (UI uses castType + optional numeric value).',
                properties: {
                  castType: {
                    type: 'string',
                    enum: ['Instant', 'Cast', 'Channel', 'Passive'],
                    description: "Type of cast. If 'Instant' or 'Passive', no numeric value is needed.",
                  },
                  value: {
                    type: 'number',
                    description: 'Numeric cast duration in seconds (only relevant if castType is Cast or Channel).',
                  },
                },
                required: ['castType'],
                additionalProperties: false,
              },
              cost: {
                type: 'object',
                description: 'Primary Cost field (numeric amount + resource type).',
                properties: {
                  value: {
                    type: 'number',
                    description: 'Numeric resource cost.',
                  },
                  costType: {
                    type: 'string',
                    enum: [
                      'Astral Power',
                      'Energy',
                      'Focus',
                      'Fury',
                      'Maelstrom',
                      'Mana',
                      'Rage',
                      'Runes',
                    ],
                    description: 'Type of resource expended.',
                  },
                },
                required: ['value', 'costType'],
                additionalProperties: false,
              },
              secondaryCost: {
                type: 'object',
                description: 'Optional Secondary Cost field (numeric amount + resource type).',
                properties: {
                  value: {
                    type: 'number',
                    description: 'Numeric secondary resource cost.',
                  },
                  costType: {
                    type: 'string',
                    enum: [
                      'Arcane Charges',
                      'Chi',
                      'Combo Points',
                      'Essence',
                      'Holy Power',
                      'Insanity',
                      'Runic Power',
                      'Soul Shards',
                    ],
                    description: 'Type of secondary resource expended.',
                  },
                },
                required: ['value', 'costType'],
                additionalProperties: false,
              },
              range: {
                type: 'object',
                description: 'Range field (numeric yards).',
                properties: {
                  value: {
                    type: 'number',
                    description: "Range in numeric yards (UI locks 'yards').",
                  },
                },
                required: ['value'],
                additionalProperties: false,
              },
              requirements: {
                type: 'object',
                description: "Seldomly used, default is empty. Requirements field, storing only the text after the locked prefix 'Requires '.",
                properties: {
                  value: {
                    type: 'string',
                    description: 'Text describing requirement (e.g. Stealth, Bear Form, etc.).',
                  },
                },
                required: ['value'],
                additionalProperties: false,
              },
              talent: {
                type: 'boolean',
                description: 'Indicates if this is a Talent (UI has a locked text Talent). Seldomly used. Default is false.',
              },
              charges: {
                type: 'object',
                description: 'Charges field (numeric count). Seldomly used. Default is empty.',
                properties: {
                  value: {
                    type: 'number',
                    description: 'Number of charges (UI locks charges).',
                  },
                },
                required: ['value'],
                additionalProperties: false,
              },
            },
            required: ['name', 'description', 'icon'],
            additionalProperties: false,
          },
        },
      },
    });

    res.status(200).json({
      content: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error fetching completion:', error);
    res.status(500).json({ error: 'Error fetching completion' });
  }
};