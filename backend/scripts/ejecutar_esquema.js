// Script para ejecutar el esquema SQL en PostgreSQL
// Usa la misma conexión que el MCP: postgresql://postgresh:root@localhost:5432/db_cine

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function ejecutarEsquema() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgresh',
    password: 'root',
    database: 'db_cine',
    ssl: false,
  });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL (db_cine)');

    const sqlPath = path.join(__dirname, '01_crear_esquema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Ejecutar todo el script SQL
    const result = await client.query(sql);
    
    // Mostrar resultados de verificación
    if (Array.isArray(result)) {
      result.forEach(r => {
        if (r.rows && r.rows.length > 0) {
          console.log('\n📊 Resultado:');
          console.table(r.rows);
        }
      });
    } else if (result.rows && result.rows.length > 0) {
      console.table(result.rows);
    }

    console.log('\n✅ Esquema de base de datos creado exitosamente');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.detail) console.error('   Detalle:', error.detail);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

ejecutarEsquema();
