import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Pelicula } from '../../peliculas/entidades/pelicula.entity';
import { Sala } from '../../salas/entidades/sala.entity';
import { Reserva } from '../../reservas/entidades/reserva.entity';

/**
 * Entidad Funcion
 * Representa la proyección de una película en una sala en una fecha/hora específica
 * Tabla: funciones
 */
@Entity('funciones')
export class Funcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pelicula_id', type: 'int' })
  peliculaId: number;

  @Column({ name: 'sala_id', type: 'int' })
  salaId: number;

  @Column({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relación: Una función pertenece a una película
  @ManyToOne(() => Pelicula, (pelicula) => pelicula.funciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pelicula_id' })
  pelicula: Pelicula;

  // Relación: Una función pertenece a una sala
  @ManyToOne(() => Sala, (sala) => sala.funciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;

  // Relación: Una función tiene muchas reservas
  @OneToMany(() => Reserva, (reserva) => reserva.funcion)
  reservas: Reserva[];
}
