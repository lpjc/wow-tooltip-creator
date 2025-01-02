const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, attributes } = req.body;
    console.log('Received attributes:', attributes); // Debug log

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: 'You analyze spell descriptions and suggest fitting color combinations. Return only the colors that would match the spell theme.',
        },
        {
          role: 'user',
          content: `Given the orinial prompt: ${prompt} and the spell description, suggest primary and secondary colors that would match its theme:\nSpell: ${attributes.description}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'color_suggestion',
          strict: false, // Allow flexibility for debugging and testing
          schema: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              primary_color: {
                type: 'string',
                enum: ['purple', 'light blue', 'dark brown', 'turquoise', 'teal', 'golden', 'black', 'cyan', 'silver', 'bronze', 'brown', 'gold', 'yellow', 'white', 'beige', 'dark purple', 'green', 'blue', 'dark gray', 'dark blue', 'pink', 'red', 'dark red', 'orange', 'grey', 'dark green', 'gray'],
                description: 'Primary color representing the spell theme.',
              },
              secondary_color: {
                type: 'string',
                enum: ['turquoise', 'black', 'beige', 'grey', 'dark brown', 'light blue', 'cream', 'light gray', 'yellow', 'green', 'dark blue', 'light green', 'gray', 'gold', 'brown', 'dark purple', 'blue', 'dark gray', 'red', 'dark red', 'purple', 'teal', 'light yellow', 'cyan', 'silver', 'white', 'tan', 'pink', 'orange', 'dark green'],
                description: 'Secondary color representing the spell theme.',
              },
            },
            required: ['primary_color', 'secondary_color'],
            additionalProperties: false,
          },
        },
      },
    });

    console.log('Raw OpenAI Response:', response.choices[0].message); // Debug log
    const colors = response.choices[0].message.content;
    console.log('Parsed colors:', colors);

    res.status(200).json({ colors: JSON.parse(colors) });
  } catch (error) {
    console.error('Full OpenAI Error:', error);
    res.status(500).json({ error: 'Error generating color query' });
  }
}
