import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guardia de Roles
 * Verifica que el usuario tenga el rol requerido para acceder a una ruta
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.get<string[]>('roles', context.getHandler());
    if (!rolesRequeridos) {
      return true; // Si no se especifican roles, se permite el acceso
    }

    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario) {
      throw new ForbiddenException('No autorizado');
    }

    const tieneRol = rolesRequeridos.includes(usuario.rol);
    if (!tieneRol) {
      throw new ForbiddenException('No tiene permisos suficientes para esta acción');
    }

    return true;
  }
}
