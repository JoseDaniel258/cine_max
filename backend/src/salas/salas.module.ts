import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sala } from './entidades/sala.entity';
import { SalasService } from './servicios/salas.service';
import { SalasController } from './controladores/salas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sala])],
  controllers: [SalasController],
  providers: [SalasService],
  exports: [SalasService],
})
export class SalasModule {}
