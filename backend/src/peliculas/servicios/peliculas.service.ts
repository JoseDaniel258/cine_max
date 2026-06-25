import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Pelicula } from '../entidades/pelicula.entity';
import { CrearPeliculaDto } from '../dto/crear-pelicula.dto';
import { ActualizarPeliculaDto } from '../dto/actualizar-pelicula.dto';


@Injectable()
export class PeliculasService {
  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculaRepositorio: Repository<Pelicula>,
  ) {}


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


  async crear(crearPeliculaDto: CrearPeliculaDto, imagenUrl?: string): Promise<Pelicula> {
    const pelicula = this.peliculaRepositorio.create({
      ...crearPeliculaDto,
      imagenUrl: imagenUrl || null,
    });
    return this.peliculaRepositorio.save(pelicula);
  }


  async actualizar(id: number, actualizarDto: ActualizarPeliculaDto, imagenUrl?: string): Promise<Pelicula> {
    const pelicula = await this.obtenerPorId(id);

    if (actualizarDto.titulo !== undefined) pelicula.titulo = actualizarDto.titulo;
    if (actualizarDto.sinopsis !== undefined) pelicula.sinopsis = actualizarDto.sinopsis;
    if (actualizarDto.genero !== undefined) pelicula.genero = actualizarDto.genero;
    if (actualizarDto.duracionMinutos !== undefined) pelicula.duracionMinutos = actualizarDto.duracionMinutos;
    if (actualizarDto.clasificacion !== undefined) pelicula.clasificacion = actualizarDto.clasificacion;
    if (imagenUrl) pelicula.imagenUrl = imagenUrl;

    return this.peliculaRepositorio.save(pelicula);
  }

  async eliminar(id: number): Promise<void> {
    const pelicula = await this.obtenerPorId(id);
    await this.peliculaRepositorio.remove(pelicula);
  }
}
