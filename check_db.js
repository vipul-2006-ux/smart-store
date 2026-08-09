const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'vipul2006',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});

client.connect()
  .then(() => client.query('SELECT datname FROM pg_database'))
  .then(res => {
    console.log(res.rows.map(r => r.datname).join(', '));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
