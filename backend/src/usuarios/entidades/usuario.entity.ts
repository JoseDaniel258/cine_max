import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Reserva } from '../../reservas/entidades/reserva.entity';


@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  contrasena: string;

  @Column({ type: 'varchar', length: 20, default: 'cliente' })
  rol: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relación: Un usuario tiene muchas reservas
  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas: Reserva[];
}
