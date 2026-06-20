import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entidades/reserva.entity';
import { ReservaAsiento } from './entidades/reserva-asiento.entity';
import { Funcion } from '../funciones/entidades/funcion.entity';
import { ReservasService } from './servicios/reservas.service';
import { ReservasController } from './controladores/reservas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, ReservaAsiento, Funcion])],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}
