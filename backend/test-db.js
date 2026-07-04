const { Client } = require('pg');

async function testConnection() {
  const connectionString = 'postgresql://postgres.tqprwyqbxzdhdvvjzbys:Samyakdande%40123@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';
  const client = new Client({
    connectionString,
  });

  try {
    console.log('Attempting to connect to the database...');
    await client.connect();
    console.log('Successfully connected to the database!');
    
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    if (err.code) {
      console.error('Error Code:', err.code);
    }
  } finally {
    await client.end();
  }
}

testConnection();
