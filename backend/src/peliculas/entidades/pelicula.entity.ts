import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Funcion } from '../../funciones/entidades/funcion.entity';

/**
 * Entidad Pelicula
 * Representa una película disponible en la cartelera
 * Tabla: peliculas
 */
@Entity('peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  sinopsis: string;

  @Column({ type: 'varchar', length: 50 })
  genero: string;

  @Column({ name: 'duracion_minutos', type: 'int' })
  duracionMinutos: number;

  @Column({ type: 'varchar', length: 20 })
  clasificacion: string;

  @Column({ name: 'imagen_url', type: 'varchar', length: 500, nullable: true })
  imagenUrl: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relación: Una película tiene muchas funciones
  @OneToMany(() => Funcion, (funcion) => funcion.pelicula)
  funciones: Funcion[];
}
