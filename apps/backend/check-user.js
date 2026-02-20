require('dotenv').config();
const db = require('./src/config/db');

async function checkUser() {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name, email, role FROM users WHERE email = ?",
      ['baldo2005_@outlook.com']
    );
    
    if (rows.length === 0) {
      console.log('❌ Usuario NO encontrado en la base de datos');
      console.log('Necesitas registrarte primero');
    } else {
      console.log('✅ Usuario encontrado:');
      console.log(rows[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();
