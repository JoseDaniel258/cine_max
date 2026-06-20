import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';

/**
 * Servicio de Usuarios
 * Operaciones de consulta sobre la tabla de usuarios
 */
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepositorio: Repository<Usuario>,
  ) {}

  /**
   * Buscar un usuario por su email
   */
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepositorio.findOne({ where: { email } });
  }

  /**
   * Buscar un usuario por su ID
   */
  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.usuarioRepositorio.findOne({ where: { id } });
  }

  /**
   * Crear un nuevo usuario
   */
  async crear(datosUsuario: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.usuarioRepositorio.create(datosUsuario);
    return this.usuarioRepositorio.save(usuario);
  }
}
