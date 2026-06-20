import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Configuración de conexión a la base de datos PostgreSQL
 * Base de datos: db_cine
 * Misma conexión utilizada por el MCP server
 */
export const configuracionBaseDatos: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgresh',
  password: 'root',
  database: 'db_cine',
  // Cargar entidades automáticamente desde los módulos
  autoLoadEntities: true,
  // No sincronizar automáticamente (las tablas ya están creadas)
  synchronize: false,
  ssl: false,
};
