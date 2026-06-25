import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';


export class CrearSalaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la sala es obligatorio' })
  nombre: string;

  @IsInt({ message: 'Las filas deben ser un número entero' })
  @Min(1, { message: 'Debe haber al menos 1 fila' })
  @Max(30, { message: 'Máximo 30 filas' })
  filas: number;

  @IsInt({ message: 'Las columnas deben ser un número entero' })
  @Min(1, { message: 'Debe haber al menos 1 columna' })
  @Max(30, { message: 'Máximo 30 columnas' })
  columnas: number;
}
