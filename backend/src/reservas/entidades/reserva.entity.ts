import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entidades/usuario.entity';
import { Funcion } from '../../funciones/entidades/funcion.entity';
import { ReservaAsiento } from './reserva-asiento.entity';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id', type: 'int' })
  usuarioId: number;

  @Column({ name: 'funcion_id', type: 'int' })
  funcionId: number;

  @Column({ name: 'cantidad_asientos', type: 'int' })
  cantidadAsientos: number;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Funcion, (funcion) => funcion.reservas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'funcion_id' })
  funcion: Funcion;

  @OneToMany(() => ReservaAsiento, (asiento) => asiento.reserva, { cascade: true })
  asientos: ReservaAsiento[];
}
