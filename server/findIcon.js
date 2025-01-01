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
    
    const { data, error } = await supabase
      .from('wow-icons')
      .select('*')
      .eq('primary_color', colors.primary_color)
      .eq('secondary_color', colors.secondary_color)
      .limit(5);

    if (error) throw error;
    
    res.status(200).json({ icons: data });
  } catch (error) {
    console.error('Error querying Supabase:', error);
    res.status(500).json({ error: 'Error querying icons' });
  }
};
