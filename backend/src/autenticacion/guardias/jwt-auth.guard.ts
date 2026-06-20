import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guardia de autenticación JWT
 * Protege rutas que requieren usuario autenticado
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
