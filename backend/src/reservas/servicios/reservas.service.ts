import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reserva } from '../entidades/reserva.entity';
import { ReservaAsiento } from '../entidades/reserva-asiento.entity';
import { Funcion } from '../../funciones/entidades/funcion.entity';
import { Sala } from '../../salas/entidades/sala.entity';
import { CrearReservaDto } from '../dto/crear-reserva.dto';


@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepositorio: Repository<Reserva>,
    @InjectRepository(ReservaAsiento)
    private readonly reservaAsientoRepositorio: Repository<ReservaAsiento>,
    @InjectRepository(Funcion)
    private readonly funcionRepositorio: Repository<Funcion>,
    private readonly dataSource: DataSource,
  ) {}


  async crear(usuarioId: number, crearReservaDto: CrearReservaDto): Promise<Reserva> {
    const funcion = await this.funcionRepositorio.findOne({
      where: { id: crearReservaDto.funcionId },
      relations: ['sala', 'pelicula'],
    });

    if (!funcion) {
      throw new NotFoundException('La función seleccionada no existe');
    }

    for (const asiento of crearReservaDto.asientos) {
      if (asiento.fila < 1 || asiento.fila > funcion.sala.filas) {
        throw new BadRequestException(
          `La fila ${asiento.fila} no existe en la sala. Rango válido: 1-${funcion.sala.filas}`,
        );
      }
      if (asiento.columna < 1 || asiento.columna > funcion.sala.columnas) {
        throw new BadRequestException(
          `La columna ${asiento.columna} no existe en la sala. Rango válido: 1-${funcion.sala.columnas}`,
        );
      }
    }

    const asientosOcupados = await this.reservaAsientoRepositorio
      .createQueryBuilder('ra')
      .where('ra.funcion_id = :funcionId', { funcionId: crearReservaDto.funcionId })
      .andWhere(
        '(ra.fila, ra.columna) IN (' +
        crearReservaDto.asientos.map((a) => `(${a.fila}, ${a.columna})`).join(', ') +
        ')',
      )
      .getMany();

    if (asientosOcupados.length > 0) {
      const codigos = asientosOcupados.map((a) => a.codigoAsiento).join(', ');
      throw new ConflictException(
        `Los siguientes asientos ya están reservados: ${codigos}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reserva = queryRunner.manager.create(Reserva, {
        usuarioId,
        funcionId: crearReservaDto.funcionId,
        cantidadAsientos: crearReservaDto.asientos.length,
      });

      const reservaGuardada = await queryRunner.manager.save(Reserva, reserva);

      const asientosEntidades = crearReservaDto.asientos.map((asiento) => {
        const letra = String.fromCharCode(64 + asiento.fila);
        const codigoAsiento = `${letra}${asiento.columna}`;

        return queryRunner.manager.create(ReservaAsiento, {
          reservaId: reservaGuardada.id,
          funcionId: crearReservaDto.funcionId,
          fila: asiento.fila,
          columna: asiento.columna,
          codigoAsiento,
        });
      });

      await queryRunner.manager.save(ReservaAsiento, asientosEntidades);

      await queryRunner.commitTransaction();

      return this.reservaRepositorio.findOne({
        where: { id: reservaGuardada.id },
        relations: ['asientos', 'funcion', 'funcion.pelicula', 'funcion.sala'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === '23505') {
        throw new ConflictException('Uno o más asientos fueron reservados por otro usuario. Intente nuevamente.');
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerMisReservas(usuarioId: number): Promise<Reserva[]> {
    return this.reservaRepositorio.find({
      where: { usuarioId },
      relations: ['asientos', 'funcion', 'funcion.pelicula', 'funcion.sala'],
      order: { creadoEn: 'DESC' },
    });
  }


  async obtenerMapaAsientos(funcionId: number) {
    const funcion = await this.funcionRepositorio.findOne({
      where: { id: funcionId },
      relations: ['sala'],
    });

    if (!funcion) {
      throw new NotFoundException('Función no encontrada');
    }

    const asientosOcupados = await this.reservaAsientoRepositorio.find({
      where: { funcionId },
    });

    const mapa = [];
    for (let fila = 1; fila <= funcion.sala.filas; fila++) {
      const filaAsientos = [];
      for (let col = 1; col <= funcion.sala.columnas; col++) {
        const letra = String.fromCharCode(64 + fila);
        const ocupado = asientosOcupados.some(
          (a) => a.fila === fila && a.columna === col,
        );
        filaAsientos.push({
          fila,
          columna: col,
          codigo: `${letra}${col}`,
          ocupado,
        });
      }
      mapa.push(filaAsientos);
    }

    return {
      funcion: {
        id: funcion.id,
        fechaHora: funcion.fechaHora,
        precio: funcion.precio,
      },
      sala: {
        id: funcion.sala.id,
        nombre: funcion.sala.nombre,
        filas: funcion.sala.filas,
        columnas: funcion.sala.columnas,
        capacidadTotal: funcion.sala.capacidadTotal,
      },
      asientosDisponibles: funcion.sala.capacidadTotal - asientosOcupados.length,
      asientosOcupados: asientosOcupados.length,
      mapa,
    };
  }
}
