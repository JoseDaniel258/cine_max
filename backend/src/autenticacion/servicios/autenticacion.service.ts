import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../../usuarios/servicios/usuarios.service';
import { RegistroDto } from '../dto/registro.dto';
import { LoginDto } from '../dto/login.dto';


@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}


  async registro(registroDto: RegistroDto) {
    const usuarioExistente = await this.usuariosService.buscarPorEmail(registroDto.email);
    if (usuarioExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    const contrasenaHasheada = await bcrypt.hash(registroDto.contrasena, 10);

    const usuario = await this.usuariosService.crear({
      nombre: registroDto.nombre,
      email: registroDto.email,
      contrasena: contrasenaHasheada,
      rol: 'cliente',
    });

    const { contrasena, ...resultado } = usuario;
    return {
      mensaje: 'Usuario registrado exitosamente',
      usuario: resultado,
    };
  }


  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.buscarPorEmail(loginDto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const contrasenaValida = await bcrypt.compare(loginDto.contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

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


  async validarUsuario(id: number) {
    return this.usuariosService.buscarPorId(id);
  }
}
