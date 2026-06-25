import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from './reserva.entity';


@Entity('reserva_asientos')
export class ReservaAsiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reserva_id', type: 'int' })
  reservaId: number;

  @Column({ name: 'funcion_id', type: 'int' })
  funcionId: number;

  @Column({ type: 'int' })
  fila: number;

  @Column({ type: 'int' })
  columna: number;

  @Column({ name: 'codigo_asiento', type: 'varchar', length: 10 })
  codigoAsiento: string;

  @ManyToOne(() => Reserva, (reserva) => reserva.asientos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;
}
