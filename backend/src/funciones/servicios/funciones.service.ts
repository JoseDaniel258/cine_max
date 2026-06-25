import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcion } from '../entidades/funcion.entity';
import { CrearFuncionDto } from '../dto/crear-funcion.dto';
import { ActualizarFuncionDto } from '../dto/actualizar-funcion.dto';


@Injectable()
export class FuncionesService {
  constructor(
    @InjectRepository(Funcion)
    private readonly funcionRepositorio: Repository<Funcion>,
  ) {}


  async listarTodas(): Promise<Funcion[]> {
    return this.funcionRepositorio.find({
      relations: ['pelicula', 'sala'],
      order: { fechaHora: 'ASC' },
    });
  }

  /**
   * Obtener una función por ID con todas sus relaciones
   */
  async obtenerPorId(id: number): Promise<Funcion> {
    const funcion = await this.funcionRepositorio.findOne({
      where: { id },
      relations: ['pelicula', 'sala'],
    });

    if (!funcion) {
      throw new NotFoundException(`Función con ID ${id} no encontrada`);
    }

    return funcion;
  }

  /**
   * Crear una nueva función
   * Valida que no exista solapamiento de horarios en la misma sala
   */
  async crear(crearFuncionDto: CrearFuncionDto): Promise<Funcion> {
    const fechaHora = new Date(crearFuncionDto.fechaHora);

    // Validar solapamiento de horarios en la misma sala
    await this.validarSolapamiento(
      crearFuncionDto.salaId,
      fechaHora,
    );

    const funcion = this.funcionRepositorio.create({
      peliculaId: crearFuncionDto.peliculaId,
      salaId: crearFuncionDto.salaId,
      fechaHora: fechaHora,
      precio: crearFuncionDto.precio,
    });

    const funcionGuardada = await this.funcionRepositorio.save(funcion);
    return this.obtenerPorId(funcionGuardada.id);
  }

  /**
   * Actualizar una función existente
   */
  async actualizar(id: number, actualizarDto: ActualizarFuncionDto): Promise<Funcion> {
    const funcion = await this.obtenerPorId(id);

    if (actualizarDto.fechaHora || actualizarDto.salaId) {
      const salaId = actualizarDto.salaId || funcion.salaId;
      const fechaHora = actualizarDto.fechaHora
        ? new Date(actualizarDto.fechaHora)
        : funcion.fechaHora;

      await this.validarSolapamiento(salaId, fechaHora, id);
    }

    if (actualizarDto.peliculaId !== undefined) funcion.peliculaId = actualizarDto.peliculaId;
    if (actualizarDto.salaId !== undefined) funcion.salaId = actualizarDto.salaId;
    if (actualizarDto.fechaHora !== undefined) funcion.fechaHora = new Date(actualizarDto.fechaHora);
    if (actualizarDto.precio !== undefined) funcion.precio = actualizarDto.precio;

    await this.funcionRepositorio.save(funcion);
    return this.obtenerPorId(id);
  }

  /**
   * Eliminar una función
   */
  async eliminar(id: number): Promise<void> {
    const funcion = await this.obtenerPorId(id);
    await this.funcionRepositorio.remove(funcion);
  }

  /**
   * Validar que no exista solapamiento de horarios en la misma sala
   * Se considera que una función dura ~3 horas como margen estándar
   * (esto cubre la duración de la película + limpieza de sala)
   */
  private async validarSolapamiento(
    salaId: number,
    fechaHora: Date,
    excluirFuncionId?: number,
  ): Promise<void> {
    // Margen de 3 horas para cada función (duración película + limpieza)
    const margenHoras = 3;
    const inicioNueva = new Date(fechaHora);
    const finNueva = new Date(fechaHora.getTime() + margenHoras * 60 * 60 * 1000);

    // Buscar funciones en la misma sala que se solapen con el rango propuesto
    const query = this.funcionRepositorio
      .createQueryBuilder('f')
      .where('f.sala_id = :salaId', { salaId })
      .andWhere(
        '(f.fecha_hora < :finNueva AND f.fecha_hora + INTERVAL \'3 hours\' > :inicioNueva)',
        { finNueva, inicioNueva },
      );

    if (excluirFuncionId) {
      query.andWhere('f.id != :excluirId', { excluirId: excluirFuncionId });
    }

    const funcionesSolapadas = await query.getCount();

    if (funcionesSolapadas > 0) {
      throw new ConflictException(
        'Ya existe una función programada en esta sala que se superpone con el horario solicitado',
      );
    }
  }
}
