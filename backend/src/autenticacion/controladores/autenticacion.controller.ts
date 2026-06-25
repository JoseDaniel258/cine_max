import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { RegistroDto } from '../dto/registro.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('registro')
  async registro(@Body() registroDto: RegistroDto) {
    return this.autenticacionService.registro(registroDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.autenticacionService.login(loginDto);
  }
}
