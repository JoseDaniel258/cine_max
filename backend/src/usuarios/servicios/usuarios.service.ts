import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepositorio: Repository<Usuario>,
  ) {}


  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepositorio.findOne({ where: { email } });
  }


  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.usuarioRepositorio.findOne({ where: { id } });
  }


  async crear(datosUsuario: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.usuarioRepositorio.create(datosUsuario);
    return this.usuarioRepositorio.save(usuario);
  }
}
