import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcion } from './entidades/funcion.entity';
import { FuncionesService } from './servicios/funciones.service';
import { FuncionesController } from './controladores/funciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Funcion])],
  controllers: [FuncionesController],
  providers: [FuncionesService],
  exports: [FuncionesService],
})
export class FuncionesModule {}
