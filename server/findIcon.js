const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mfnfsulsalsvcwtizrtc.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function findIconHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { colors } = req.body;

    console.log('Received Colors for Icon Query:', colors);

    const { data, error } = await supabase
      .from('icons')
      .select('*')
      .eq('primary_color', colors.primary_color)
      .contains('secondary_colors', [colors.secondary_color]) // Adjusted for array matching
      .limit(5);

    if (error) {
      console.error('Supabase Query Error:', error);
      return res.status(500).json({ error: 'Error querying icons' });
    }

    if (!data || data.length === 0) {
      console.warn('No matching icons found');
      return res.status(404).json({ error: 'No matching icons found' });
    }

    console.log('Query Result:', data);

    res.status(200).json({ icons: data });
  } catch (error) {
    console.error('Unexpected Error in findIconHandler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
