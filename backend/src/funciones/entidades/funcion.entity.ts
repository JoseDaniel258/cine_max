import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Pelicula } from '../../peliculas/entidades/pelicula.entity';
import { Sala } from '../../salas/entidades/sala.entity';
import { Reserva } from '../../reservas/entidades/reserva.entity';


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

  @ManyToOne(() => Pelicula, (pelicula) => pelicula.funciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pelicula_id' })
  pelicula: Pelicula;

  @ManyToOne(() => Sala, (sala) => sala.funciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;

  @OneToMany(() => Reserva, (reserva) => reserva.funcion)
  reservas: Reserva[];
}
