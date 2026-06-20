import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para definir roles requeridos en un endpoint
 * Uso: @Roles('admin') o @Roles('admin', 'cliente')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
