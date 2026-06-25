import { IsNotEmpty, IsInt, IsNumber, IsDateString, Min } from 'class-validator';


export class CrearFuncionDto {
  @IsInt({ message: 'El ID de película debe ser un número entero' })
  @IsNotEmpty({ message: 'La película es obligatoria' })
  peliculaId: number;

  @IsInt({ message: 'El ID de sala debe ser un número entero' })
  @IsNotEmpty({ message: 'La sala es obligatoria' })
  salaId: number;

  @IsDateString({}, { message: 'La fecha y hora deben tener formato válido (ISO 8601)' })
  @IsNotEmpty({ message: 'La fecha y hora son obligatorias' })
  fechaHora: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  precio: number;
}
