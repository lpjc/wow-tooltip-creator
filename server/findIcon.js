const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = 'https://mfnfsulsalsvcwtizrtc.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function findIconHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { colors, spellDescription } = req.body;
    console.log('Received for icon selection:', { colors, spellDescription });

    if (!spellDescription) {
      console.error('Missing spell description');
      return res.status(400).json({ error: 'Missing spell description' });
    }

    // First get matching icons from Supabase
    const { data: icons, error } = await supabase
      .from('icons')
      .select('*')
      .eq('primary_color', colors.primary_color)
      .contains('secondary_colors', [colors.secondary_color])
      .limit(15);

    if (error) {
      console.error('Supabase Query Error:', error);
      return res.status(500).json({ error: 'Error querying icons' });
    }

    if (!icons || icons.length === 0) {
      console.warn('No matching icons found');
      return res.status(404).json({ error: 'No matching icons found' });
    }

    // Let AI select best matching icon
    console.log('Found Icons:', icons.length);
    console.log('Icons as string:', JSON.stringify(icons));
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: `You are an expert at matching spell descriptions with appropriate icons. Select the most thematically appropriate icon based on the description.`
        },
        {
          role: 'user',
          content: `Given this spell description: "${spellDescription}"
Available icons (${icons.length}):
${JSON.stringify(icons, null, 2)}
Select the most appropriate icon index (0-${icons.length-1}).`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'icon_selection',
          schema: {
            type: 'object',
            properties: {
              selected_index: {
                type: 'number',
                minimum: 0,
                maximum: icons.length - 1
              }
            },
            required: ['selected_index'],
            additionalProperties: false
          }
        }
      }
    });

    console.log('Full AI Response:', response.choices[0].message);
    const selection = JSON.parse(response.choices[0].message.content);
    console.log('Selected Index:', selection.selected_index);

    // Return selected icon
    res.status(200).json({
      icons: [icons[selection.selected_index]]
    });

  } catch (error) {
    console.error('Unexpected Error in findIconHandler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};