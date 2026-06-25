import { TypeOrmModuleOptions } from '@nestjs/typeorm';


export const configuracionBaseDatos: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '3358',
  database: 'db_cine',
  autoLoadEntities: true,
  synchronize: false,
  ssl: false,
};
