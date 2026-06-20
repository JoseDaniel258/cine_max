import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../../usuarios/servicios/usuarios.service';
import { RegistroDto } from '../dto/registro.dto';
import { LoginDto } from '../dto/login.dto';

/**
 * Servicio de Autenticación
 * Maneja registro, login y generación de tokens JWT
 */
@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registrar un nuevo usuario
   * Hashea la contraseña con bcrypt antes de guardarla
   */
  async registro(registroDto: RegistroDto) {
    // Verificar si el email ya existe
    const usuarioExistente = await this.usuariosService.buscarPorEmail(registroDto.email);
    if (usuarioExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const contrasenaHasheada = await bcrypt.hash(registroDto.contrasena, 10);

    // Crear el usuario
    const usuario = await this.usuariosService.crear({
      nombre: registroDto.nombre,
      email: registroDto.email,
      contrasena: contrasenaHasheada,
      rol: 'cliente',
    });

    // Retornar datos sin la contraseña
    const { contrasena, ...resultado } = usuario;
    return {
      mensaje: 'Usuario registrado exitosamente',
      usuario: resultado,
    };
  }

  /**
   * Iniciar sesión
   * Valida credenciales y retorna un token JWT
   */
  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.buscarPorEmail(loginDto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparar contraseña con bcrypt
    const contrasenaValida = await bcrypt.compare(loginDto.contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    const token = this.jwtService.sign(payload);

    return {
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  /**
   * Validar un usuario por su ID (usado por JwtStrategy)
   */
  async validarUsuario(id: number) {
    return this.usuariosService.buscarPorId(id);
  }
}
