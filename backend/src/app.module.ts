import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuracionBaseDatos } from './configuracion/database.config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PeliculasModule } from './peliculas/peliculas.module';
import { SalasModule } from './salas/salas.module';
import { FuncionesModule } from './funciones/funciones.module';
import { ReservasModule } from './reservas/reservas.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';

@Module({
  imports: [
    // Conexión a PostgreSQL
    TypeOrmModule.forRoot(configuracionBaseDatos),
    // Módulos del sistema
    AutenticacionModule,
    UsuariosModule,
    PeliculasModule,
    SalasModule,
    FuncionesModule,
    ReservasModule,
  ],
})
export class AppModule {}
