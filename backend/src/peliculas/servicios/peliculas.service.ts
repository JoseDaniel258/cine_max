import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Pelicula } from '../entidades/pelicula.entity';
import { CrearPeliculaDto } from '../dto/crear-pelicula.dto';
import { ActualizarPeliculaDto } from '../dto/actualizar-pelicula.dto';

/**
 * Servicio de Películas
 * CRUD completo + búsqueda por nombre y filtro por género
 */
@Injectable()
export class PeliculasService {
  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculaRepositorio: Repository<Pelicula>,
  ) {}

  /**
   * Listar todas las películas con búsqueda opcional y filtro por género
   */
  async listarTodas(busqueda?: string, genero?: string): Promise<Pelicula[]> {
    const donde: any = {};

    if (busqueda) {
      donde.titulo = ILike(`%${busqueda}%`);
    }
    if (genero) {
      donde.genero = genero;
    }

    return this.peliculaRepositorio.find({
      where: donde,
      order: { creadoEn: 'DESC' },
    });
  }

  /**
   * Obtener detalle de una película con sus funciones disponibles
   */
  async obtenerPorId(id: number): Promise<Pelicula> {
    const pelicula = await this.peliculaRepositorio.findOne({
      where: { id },
      relations: ['funciones', 'funciones.sala'],
    });

    if (!pelicula) {
      throw new NotFoundException(`Película con ID ${id} no encontrada`);
    }

    return pelicula;
  }

  /**
   * Crear una nueva película
   */
  async crear(crearPeliculaDto: CrearPeliculaDto, imagenUrl?: string): Promise<Pelicula> {
    const pelicula = this.peliculaRepositorio.create({
      ...crearPeliculaDto,
      imagenUrl: imagenUrl || null,
    });
    return this.peliculaRepositorio.save(pelicula);
  }

  /**
   * Actualizar una película existente
   */
  async actualizar(id: number, actualizarDto: ActualizarPeliculaDto, imagenUrl?: string): Promise<Pelicula> {
    const pelicula = await this.obtenerPorId(id);

    // Mapear campos del DTO a la entidad
    if (actualizarDto.titulo !== undefined) pelicula.titulo = actualizarDto.titulo;
    if (actualizarDto.sinopsis !== undefined) pelicula.sinopsis = actualizarDto.sinopsis;
    if (actualizarDto.genero !== undefined) pelicula.genero = actualizarDto.genero;
    if (actualizarDto.duracionMinutos !== undefined) pelicula.duracionMinutos = actualizarDto.duracionMinutos;
    if (actualizarDto.clasificacion !== undefined) pelicula.clasificacion = actualizarDto.clasificacion;
    if (imagenUrl) pelicula.imagenUrl = imagenUrl;

    return this.peliculaRepositorio.save(pelicula);
  }

  /**
   * Eliminar una película
   */
  async eliminar(id: number): Promise<void> {
    const pelicula = await this.obtenerPorId(id);
    await this.peliculaRepositorio.remove(pelicula);
  }
}
