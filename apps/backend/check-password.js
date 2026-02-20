require('dotenv').config();
const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function checkPassword() {
  try {
    const [rows] = await db.query(
      "SELECT password_hash FROM users WHERE email = ?",
      ['baldo2005_@outlook.com']
    );
    
    if (rows.length === 0) {
      console.log('❌ Usuario NO encontrado');
      process.exit(1);
    }
    
    const hash = rows[0].password_hash;
    const password = 'Martinez24';
    
    const match = await bcrypt.compare(password, hash);
    
    if (match) {
      console.log('✅ Contraseña CORRECTA');
    } else {
      console.log('❌ Contraseña INCORRECTA');
      console.log('Hash en DB:', hash);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPassword();
