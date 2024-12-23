import dotenv from 'dotenv';
dotenv.config();
import pg from "pg";

const pool = new pg.Pool({
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.PORT,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

async function testConnect() {
  try {
    console.log('Tentando conectar ao banco de dados...');
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Conexão bem-sucedida!', res.rows[0]);
    client.release();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  } finally {
    await pool.end();
  }
}
export default pool;


