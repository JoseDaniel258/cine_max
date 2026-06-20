import {
  Controller, Get, Post, Param, Body,
  UseGuards, Request, ParseIntPipe,
} from '@nestjs/common';
import { ReservasService } from '../servicios/reservas.service';
import { CrearReservaDto } from '../dto/crear-reserva.dto';
import { JwtAuthGuard } from '../../autenticacion/guardias/jwt-auth.guard';

/**
 * Controlador de Reservas
 * Todos los endpoints requieren usuario autenticado
 */
@Controller('reservas')
@UseGuards(JwtAuthGuard)
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  /**
   * POST /api/reservas
   * Crear una nueva reserva con asientos seleccionados
   */
  @Post()
  async crear(@Request() req, @Body() crearReservaDto: CrearReservaDto) {
    return this.reservasService.crear(req.user.id, crearReservaDto);
  }

  /**
   * GET /api/reservas/mis-reservas
   * Obtener las reservas del usuario autenticado
   */
  @Get('mis-reservas')
  async obtenerMisReservas(@Request() req) {
    return this.reservasService.obtenerMisReservas(req.user.id);
  }

  /**
   * GET /api/reservas/funcion/:id/asientos
   * Obtener el mapa de asientos de una función
   */
  @Get('funcion/:id/asientos')
  async obtenerMapaAsientos(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.obtenerMapaAsientos(id);
  }
}
