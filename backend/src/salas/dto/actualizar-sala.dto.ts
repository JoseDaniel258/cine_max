import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class ActualizarSalaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  filas?: number;

  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  columnas?: number;
}
