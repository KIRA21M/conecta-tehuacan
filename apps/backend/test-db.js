require("dotenv").config();
const pool = require("./src/config/db");

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result, DATABASE() AS db");
    console.log("✅ Conexión exitosa a AWS RDS");
    console.log("📊 Base de datos:", rows[0].db);
    console.log("🧪 Test query:", rows[0].result);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    process.exit(1);
  }
}

testConnection();
