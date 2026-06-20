import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AutenticacionService } from '../servicios/autenticacion.service';

/**
 * Estrategia JWT para Passport
 * Extrae y valida el token JWT del header Authorization
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly autenticacionService: AutenticacionService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'cine_secret_key_2026',
    });
  }

  /**
   * Valida el payload del JWT y retorna el usuario
   */
  async validate(payload: any) {
    const usuario = await this.autenticacionService.validarUsuario(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException('Token inválido');
    }
    return {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.nombre,
    };
  }
}
