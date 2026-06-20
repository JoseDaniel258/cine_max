import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { FuncionesService } from '../servicios/funciones.service';
import { CrearFuncionDto } from '../dto/crear-funcion.dto';
import { ActualizarFuncionDto } from '../dto/actualizar-funcion.dto';
import { JwtAuthGuard } from '../../autenticacion/guardias/jwt-auth.guard';
import { RolesGuard } from '../../autenticacion/guardias/roles.guard';
import { Roles } from '../../autenticacion/decoradores/roles.decorator';

/**
 * Controlador de Funciones
 * GET es público, POST/PATCH/DELETE requieren admin
 */
@Controller('funciones')
export class FuncionesController {
  constructor(private readonly funcionesService: FuncionesService) {}

  /**
   * GET /api/funciones
   * Listar todas las funciones disponibles (público)
   */
  @Get()
  async listarTodas() {
    return this.funcionesService.listarTodas();
  }

  /**
   * GET /api/funciones/:id
   * Detalle de una función (público)
   */
  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.funcionesService.obtenerPorId(id);
  }

  /**
   * POST /api/funciones
   * Crear función (solo admin) - valida solapamiento de horarios
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async crear(@Body() crearFuncionDto: CrearFuncionDto) {
    return this.funcionesService.crear(crearFuncionDto);
  }

  /**
   * PATCH /api/funciones/:id
   * Editar función (solo admin)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarDto: ActualizarFuncionDto,
  ) {
    return this.funcionesService.actualizar(id, actualizarDto);
  }

  /**
   * DELETE /api/funciones/:id
   * Eliminar función (solo admin)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.funcionesService.eliminar(id);
    return { mensaje: 'Función eliminada exitosamente' };
  }
}
