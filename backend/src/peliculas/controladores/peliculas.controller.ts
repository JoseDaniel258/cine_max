import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards, UseInterceptors,
  UploadedFile, ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PeliculasService } from '../servicios/peliculas.service';
import { CrearPeliculaDto } from '../dto/crear-pelicula.dto';
import { ActualizarPeliculaDto } from '../dto/actualizar-pelicula.dto';
import { JwtAuthGuard } from '../../autenticacion/guardias/jwt-auth.guard';
import { RolesGuard } from '../../autenticacion/guardias/roles.guard';
import { Roles } from '../../autenticacion/decoradores/roles.decorator';


const almacenamientoPosters = diskStorage({
  destination: './uploads/posters',
  filename: (req, file, callback) => {
    const nombreUnico = `poster_${Date.now()}${extname(file.originalname)}`;
    callback(null, nombreUnico);
  },
});


@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}


  @Get()
  async listarTodas(
    @Query('busqueda') busqueda?: string,
    @Query('genero') genero?: string,
  ) {
    return this.peliculasService.listarTodas(busqueda, genero);
  }


  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.peliculasService.obtenerPorId(id);
  }


  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('imagen', { storage: almacenamientoPosters }))
  async crear(
    @Body() crearPeliculaDto: CrearPeliculaDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    const imagenUrl = imagen ? `/uploads/posters/${imagen.filename}` : undefined;
    return this.peliculasService.crear(crearPeliculaDto, imagenUrl);
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('imagen', { storage: almacenamientoPosters }))
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarDto: ActualizarPeliculaDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    const imagenUrl = imagen ? `/uploads/posters/${imagen.filename}` : undefined;
    return this.peliculasService.actualizar(id, actualizarDto, imagenUrl);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.peliculasService.eliminar(id);
    return { mensaje: 'Película eliminada exitosamente' };
  }
}
