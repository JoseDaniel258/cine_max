import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { RegistroDto } from '../dto/registro.dto';
import { LoginDto } from '../dto/login.dto';

/**
 * Controlador de Autenticación
 * Endpoints: POST /api/autenticacion/registro, POST /api/autenticacion/login
 */
@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  /**
   * POST /api/autenticacion/registro
   * Registrar un nuevo usuario
   */
  @Post('registro')
  async registro(@Body() registroDto: RegistroDto) {
    return this.autenticacionService.registro(registroDto);
  }

  /**
   * POST /api/autenticacion/login
   * Iniciar sesión y obtener token JWT
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.autenticacionService.login(loginDto);
  }
}
