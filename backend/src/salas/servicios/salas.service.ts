import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from '../entidades/sala.entity';
import { CrearSalaDto } from '../dto/crear-sala.dto';
import { ActualizarSalaDto } from '../dto/actualizar-sala.dto';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepositorio: Repository<Sala>,
  ) {}

  async listarTodas(): Promise<Sala[]> {
    return this.salaRepositorio.find({ order: { id: 'ASC' } });
  }

  async obtenerPorId(id: number): Promise<Sala> {
    const sala = await this.salaRepositorio.findOne({ where: { id } });
    if (!sala) {
      throw new NotFoundException(`Sala con ID ${id} no encontrada`);
    }
    return sala;
  }

  async crear(crearSalaDto: CrearSalaDto): Promise<Sala> {
    const sala = this.salaRepositorio.create(crearSalaDto);
    return this.salaRepositorio.save(sala);
  }

  async actualizar(id: number, actualizarDto: ActualizarSalaDto): Promise<Sala> {
    const sala = await this.obtenerPorId(id);
    Object.assign(sala, actualizarDto);
    return this.salaRepositorio.save(sala);
  }

  async eliminar(id: number): Promise<void> {
    const sala = await this.obtenerPorId(id);
    await this.salaRepositorio.remove(sala);
  }
}
