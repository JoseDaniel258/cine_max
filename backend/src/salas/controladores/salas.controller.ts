import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { SalasService } from '../servicios/salas.service';
import { CrearSalaDto } from '../dto/crear-sala.dto';
import { ActualizarSalaDto } from '../dto/actualizar-sala.dto';
import { JwtAuthGuard } from '../../autenticacion/guardias/jwt-auth.guard';
import { RolesGuard } from '../../autenticacion/guardias/roles.guard';
import { Roles } from '../../autenticacion/decoradores/roles.decorator';

@Controller('salas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Get()
  async listarTodas() {
    return this.salasService.listarTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.salasService.obtenerPorId(id);
  }

  @Post()
  async crear(@Body() crearSalaDto: CrearSalaDto) {
    return this.salasService.crear(crearSalaDto);
  }


  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarDto: ActualizarSalaDto,
  ) {
    return this.salasService.actualizar(id, actualizarDto);
  }

  @Delete(':id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.salasService.eliminar(id);
    return { mensaje: 'Sala eliminada exitosamente' };
  }
}
