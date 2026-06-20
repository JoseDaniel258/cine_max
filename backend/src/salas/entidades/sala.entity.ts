import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Funcion } from '../../funciones/entidades/funcion.entity';

/**
 * Entidad Sala
 * Representa una sala de cine con su distribución de asientos (filas x columnas)
 * Tabla: salas
 */
@Entity('salas')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @Column({ type: 'int' })
  filas: number;

  @Column({ type: 'int' })
  columnas: number;

  @Column({ name: 'capacidad_total', type: 'int', insert: false, update: false })
  capacidadTotal: number;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relación: Una sala tiene muchas funciones
  @OneToMany(() => Funcion, (funcion) => funcion.sala)
  funciones: Funcion[];
}
