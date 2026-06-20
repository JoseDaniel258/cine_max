import { IsNotEmpty, IsString, IsInt, IsIn, IsOptional, Min } from 'class-validator';

// Lista fija de géneros permitidos
export const GENEROS_VALIDOS = [
  'Acción', 'Comedia', 'Drama', 'Terror',
  'Ciencia Ficción', 'Romance', 'Animación',
  'Aventura', 'Suspenso', 'Fantasía',
];

// Clasificaciones permitidas
export const CLASIFICACIONES_VALIDAS = ['Todo público', '+14', 'R'];

/**
 * DTO para crear una nueva película
 */
export class CrearPeliculaDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsString()
  @IsOptional()
  sinopsis?: string;

  @IsString()
  @IsIn(GENEROS_VALIDOS, { message: 'El género no es válido' })
  @IsNotEmpty({ message: 'El género es obligatorio' })
  genero: string;

  @IsInt({ message: 'La duración debe ser un número entero' })
  @Min(1, { message: 'La duración debe ser mayor a 0' })
  duracionMinutos: number;

  @IsString()
  @IsIn(CLASIFICACIONES_VALIDAS, { message: 'La clasificación no es válida. Opciones: Todo público, +14, R' })
  @IsNotEmpty({ message: 'La clasificación es obligatoria' })
  clasificacion: string;
}
