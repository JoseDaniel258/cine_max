import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AutenticacionService } from './servicios/autenticacion.service';
import { AutenticacionController } from './controladores/autenticacion.controller';
import { JwtStrategy } from './estrategias/jwt.strategy';

@Module({
  imports: [
    UsuariosModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'cine_secret_key_2026',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, JwtStrategy],
  exports: [AutenticacionService, JwtModule, PassportModule],
})
export class AutenticacionModule {}
