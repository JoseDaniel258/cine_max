import { IsString, IsInt, IsIn, IsOptional, Min } from 'class-validator';
import { GENEROS_VALIDOS, CLASIFICACIONES_VALIDAS } from './crear-pelicula.dto';

/**
 * DTO para actualizar una película existente
 * Todos los campos son opcionales
 */
export class ActualizarPeliculaDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  sinopsis?: string;

  @IsString()
  @IsIn(GENEROS_VALIDOS, { message: 'El género no es válido' })
  @IsOptional()
  genero?: string;

  @IsInt({ message: 'La duración debe ser un número entero' })
  @Min(1, { message: 'La duración debe ser mayor a 0' })
  @IsOptional()
  duracionMinutos?: number;

  @IsString()
  @IsIn(CLASIFICACIONES_VALIDAS, { message: 'La clasificación no es válida' })
  @IsOptional()
  clasificacion?: string;
}
