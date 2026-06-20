import { IsNotEmpty, IsInt, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Representa un asiento seleccionado por el usuario
 */
export class AsientoDto {
  @IsInt({ message: 'La fila debe ser un número entero' })
  fila: number;

  @IsInt({ message: 'La columna debe ser un número entero' })
  columna: number;
}

/**
 * DTO para crear una nueva reserva
 */
export class CrearReservaDto {
  @IsInt({ message: 'El ID de función debe ser un número entero' })
  @IsNotEmpty({ message: 'La función es obligatoria' })
  funcionId: number;

  @IsArray({ message: 'Los asientos deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un asiento' })
  @ValidateNested({ each: true })
  @Type(() => AsientoDto)
  asientos: AsientoDto[];
}
