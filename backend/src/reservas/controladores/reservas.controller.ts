import {
  Controller, Get, Post, Param, Body,
  UseGuards, Request, ParseIntPipe,
} from '@nestjs/common';
import { ReservasService } from '../servicios/reservas.service';
import { CrearReservaDto } from '../dto/crear-reserva.dto';
import { JwtAuthGuard } from '../../autenticacion/guardias/jwt-auth.guard';

@Controller('reservas')
@UseGuards(JwtAuthGuard)
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  async crear(@Request() req, @Body() crearReservaDto: CrearReservaDto) {
    return this.reservasService.crear(req.user.id, crearReservaDto);
  }

  @Get('mis-reservas')
  async obtenerMisReservas(@Request() req) {
    return this.reservasService.obtenerMisReservas(req.user.id);
  }


  @Get('funcion/:id/asientos')
  async obtenerMapaAsientos(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.obtenerMapaAsientos(id);
  }
}
