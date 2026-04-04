const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getId() {
  const { data, error } = await supabase
    .from('portfolios')
    .select('id, username, is_published')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching portfolio:', error);
    process.exit(1);
  }
  console.log(JSON.stringify(data));
}

getId();
