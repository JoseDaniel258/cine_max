import { IsInt, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';

export class ActualizarFuncionDto {
  @IsInt()
  @IsOptional()
  peliculaId?: number;

  @IsInt()
  @IsOptional()
  salaId?: number;

  @IsDateString()
  @IsOptional()
  fechaHora?: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  precio?: number;
}
