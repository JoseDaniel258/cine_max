-- ============================================================
-- Sistema de Gestión de Cartelera y Reserva de Asientos
-- Script de creación de esquema de base de datos
-- Base de datos: db_cine
-- ============================================================

-- Habilitar extensión para hash de contraseñas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- TABLA: usuarios
-- Almacena los datos de clientes y administradores
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente' 
        CHECK (rol IN ('cliente', 'admin')),
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda rápida por email (login)
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- ============================================================
-- TABLA: peliculas
-- Almacena la información de las películas en cartelera
-- ============================================================
CREATE TABLE IF NOT EXISTS peliculas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    sinopsis TEXT,
    genero VARCHAR(50) NOT NULL 
        CHECK (genero IN (
            'Acción', 'Comedia', 'Drama', 'Terror', 
            'Ciencia Ficción', 'Romance', 'Animación', 
            'Aventura', 'Suspenso', 'Fantasía'
        )),
    duracion_minutos INTEGER NOT NULL CHECK (duracion_minutos > 0),
    clasificacion VARCHAR(20) NOT NULL 
        CHECK (clasificacion IN ('Todo público', '+14', 'R')),
    imagen_url VARCHAR(500),
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda por título
CREATE INDEX IF NOT EXISTS idx_peliculas_titulo ON peliculas(titulo);
-- Índice para filtro por género
CREATE INDEX IF NOT EXISTS idx_peliculas_genero ON peliculas(genero);

-- ============================================================
-- TABLA: salas
-- Define las salas del cine con su distribución de asientos
-- ============================================================
CREATE TABLE IF NOT EXISTS salas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    filas INTEGER NOT NULL CHECK (filas > 0 AND filas <= 30),
    columnas INTEGER NOT NULL CHECK (columnas > 0 AND columnas <= 30),
    capacidad_total INTEGER GENERATED ALWAYS AS (filas * columnas) STORED,
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: funciones
-- Representa la proyección de una película en una sala
-- en una fecha/hora específica con un precio determinado
-- ============================================================
CREATE TABLE IF NOT EXISTS funciones (
    id SERIAL PRIMARY KEY,
    pelicula_id INTEGER NOT NULL 
        REFERENCES peliculas(id) ON DELETE CASCADE,
    sala_id INTEGER NOT NULL 
        REFERENCES salas(id) ON DELETE CASCADE,
    fecha_hora TIMESTAMP NOT NULL,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índice para verificar solapamientos de horarios en la misma sala
CREATE INDEX IF NOT EXISTS idx_funciones_sala_fecha ON funciones(sala_id, fecha_hora);
-- Índice para buscar funciones por película
CREATE INDEX IF NOT EXISTS idx_funciones_pelicula ON funciones(pelicula_id);

-- ============================================================
-- TABLA: reservas
-- Registra las reservas realizadas por los usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    funcion_id INTEGER NOT NULL 
        REFERENCES funciones(id) ON DELETE CASCADE,
    cantidad_asientos INTEGER NOT NULL CHECK (cantidad_asientos > 0),
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índice para consultar reservas de un usuario (mis reservas)
CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas(usuario_id);
-- Índice para consultar reservas de una función
CREATE INDEX IF NOT EXISTS idx_reservas_funcion ON reservas(funcion_id);

-- ============================================================
-- TABLA: reserva_asientos
-- Detalle individual de cada asiento reservado
-- El UNIQUE constraint (funcion_id, fila, columna) garantiza
-- que un asiento NO pueda reservarse dos veces para la misma función
-- ============================================================
CREATE TABLE IF NOT EXISTS reserva_asientos (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL 
        REFERENCES reservas(id) ON DELETE CASCADE,
    funcion_id INTEGER NOT NULL 
        REFERENCES funciones(id) ON DELETE CASCADE,
    fila INTEGER NOT NULL CHECK (fila > 0),
    columna INTEGER NOT NULL CHECK (columna > 0),
    codigo_asiento VARCHAR(10) NOT NULL,
    CONSTRAINT uq_asiento_funcion UNIQUE (funcion_id, fila, columna)
);

-- Índice para consultar asientos ocupados de una función
CREATE INDEX IF NOT EXISTS idx_reserva_asientos_funcion ON reserva_asientos(funcion_id);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Usuario administrador por defecto
-- Email: admin@cine.com | Contraseña: admin123
INSERT INTO usuarios (nombre, email, contrasena, rol) 
VALUES (
    'Administrador',
    'admin@cine.com',
    crypt('admin123', gen_salt('bf', 10)),
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- PELÍCULAS DE EJEMPLO
-- ============================================================
INSERT INTO peliculas (titulo, sinopsis, genero, duracion_minutos, clasificacion) VALUES
(
    'Aventura en las Estrellas',
    'Un grupo de astronautas se embarca en una misión para explorar un nuevo sistema solar, enfrentando peligros desconocidos y descubriendo secretos del universo que cambiarán la historia de la humanidad.',
    'Ciencia Ficción',
    148,
    'Todo público'
),
(
    'El Último Guardián',
    'Un guerrero solitario debe proteger a una aldea de las fuerzas oscuras que amenazan con destruir todo lo que conoce. Con valentía y honor, luchará hasta el final.',
    'Acción',
    132,
    '+14'
),
(
    'Risas en la Ciudad',
    'Tres amigos de la infancia se reencuentran después de 20 años y deciden emprender un viaje por carretera que los llevará a vivir las situaciones más hilarantes e inesperadas de sus vidas.',
    'Comedia',
    105,
    'Todo público'
),
(
    'Sombras del Pasado',
    'Una detective investiga una serie de crímenes misteriosos que parecen estar conectados con eventos sobrenaturales ocurridos hace décadas en un pueblo abandonado.',
    'Terror',
    118,
    'R'
),
(
    'Corazones de Cristal',
    'Dos personas de mundos completamente diferentes se encuentran por casualidad en un café de París y descubren que el amor puede superar cualquier barrera cultural y social.',
    'Romance',
    125,
    'Todo público'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SALAS DE EJEMPLO
-- ============================================================
INSERT INTO salas (nombre, filas, columnas) VALUES
('Sala 1 - Estándar', 8, 10),
('Sala 2 - Premium', 6, 8),
('Sala 3 - IMAX', 10, 12)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================================
-- FUNCIONES DE EJEMPLO
-- (Se crean para los próximos días)
-- ============================================================
INSERT INTO funciones (pelicula_id, sala_id, fecha_hora, precio) VALUES
-- Aventura en las Estrellas - Sala IMAX
(1, 3, '2026-06-21 14:00:00', 55.00),
(1, 3, '2026-06-21 18:00:00', 65.00),
-- El Último Guardián - Sala 1
(2, 1, '2026-06-21 15:00:00', 40.00),
(2, 1, '2026-06-21 20:00:00', 45.00),
-- Risas en la Ciudad - Sala 2
(3, 2, '2026-06-22 16:00:00', 35.00),
-- Sombras del Pasado - Sala 1
(4, 1, '2026-06-22 22:00:00', 45.00),
-- Corazones de Cristal - Sala 2
(5, 2, '2026-06-22 19:00:00', 38.00);

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT 'Esquema creado exitosamente' AS resultado;
SELECT 'Tabla: usuarios' AS tabla, COUNT(*) AS registros FROM usuarios
UNION ALL
SELECT 'Tabla: peliculas', COUNT(*) FROM peliculas
UNION ALL
SELECT 'Tabla: salas', COUNT(*) FROM salas
UNION ALL
SELECT 'Tabla: funciones', COUNT(*) FROM funciones
UNION ALL
SELECT 'Tabla: reservas', COUNT(*) FROM reservas
UNION ALL
SELECT 'Tabla: reserva_asientos', COUNT(*) FROM reserva_asientos;
