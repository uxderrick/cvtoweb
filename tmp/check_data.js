const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://cujesaxgibnjlvlepidb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1amVzYXhnaWJuamx2bGVwaWRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI0NzI3NSwiZXhwIjoyMDg5ODIzMjc1fQ.dYk0pYK35wXFKxzC6AJHmQB2q-q0u4eg4sTpOvGFe_s');

async function check() {
  const { data, error } = await supabase.from('portfolios').select('id, username, is_published').limit(5);
  if (error) console.error(error);
  else console.log(data);
}
check();
