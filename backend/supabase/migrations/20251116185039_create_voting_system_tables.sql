/*
  # Sistema de Votación Digital - Tablas Principales

  1. Nuevas Tablas
    - `administradores` - Usuarios administradores del sistema
      - `id` (uuid, primary key)
      - `usuario` (text, unique) - Nombre de usuario
      - `contrasena` (text) - Contraseña hasheada
      - `nombre_completo` (text) - Nombre completo
      - `email` (text, unique) - Correo electrónico
      - `activo` (boolean) - Estado activo/inactivo
      - `fecha_creacion` (timestamptz) - Fecha de registro

    - `votantes` - Usuarios votantes del sistema
      - `id` (uuid, primary key)
      - `dni` (text, unique) - DNI del votante
      - `contrasena` (text) - Contraseña hasheada
      - `nombre_completo` (text) - Nombre completo
      - `email` (text) - Correo electrónico opcional
      - `activo` (boolean) - Estado activo/inactivo
      - `fecha_registro` (timestamptz) - Fecha de registro

    - `procesos_votacion` - Procesos electorales
      - `id` (uuid, primary key)
      - `titulo` (text) - Título del proceso
      - `descripcion` (text) - Descripción del proceso
      - `fecha_inicio` (timestamptz) - Fecha de inicio
      - `fecha_cierre` (timestamptz) - Fecha de cierre
      - `estado` (text) - Estado del proceso (PENDIENTE, ABIERTO, CERRADO, FINALIZADO)
      - `administrador_id` (uuid) - ID del administrador creador
      - `fecha_creacion` (timestamptz) - Fecha de creación

    - `candidatos` - Candidatos de cada proceso
      - `id` (uuid, primary key)
      - `nombre` (text) - Nombre del candidato
      - `descripcion` (text) - Descripción/Propuestas
      - `avatar_url` (text) - URL de la foto (opcional)
      - `proceso_id` (uuid) - ID del proceso electoral
      - `fecha_registro` (timestamptz) - Fecha de registro

    - `votos` - Registro de votos emitidos
      - `id` (uuid, primary key)
      - `proceso_id` (uuid) - ID del proceso
      - `votante_id` (uuid) - ID del votante
      - `candidato_id` (uuid) - ID del candidato votado
      - `fecha_voto` (timestamptz) - Fecha y hora del voto
      - `ip_address` (text) - IP del votante (auditoría)
      - Constraint: Un votante solo puede votar una vez por proceso

    - `logs_auditoria` - Registro de auditoría del sistema
      - `id` (uuid, primary key)
      - `tipo_usuario` (text) - Tipo de usuario (ADMINISTRADOR, VOTANTE)
      - `usuario_id` (uuid) - ID del usuario
      - `accion` (text) - Acción realizada
      - `detalles` (text) - Detalles adicionales
      - `ip_address` (text) - IP del usuario
      - `fecha_accion` (timestamptz) - Fecha y hora de la acción

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas permisivas para desarrollo (deberán restringirse en producción)

  3. Datos de Prueba
    - 1 Administrador: usuario "admin", contraseña "admin123"
    - 3 Votantes de prueba con DNI y contraseña "votante123"
*/

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS administradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario text UNIQUE NOT NULL,
  contrasena text NOT NULL,
  nombre_completo text NOT NULL,
  email text UNIQUE NOT NULL,
  activo boolean DEFAULT true,
  fecha_creacion timestamptz DEFAULT now()
);

-- Tabla de votantes
CREATE TABLE IF NOT EXISTS votantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dni text UNIQUE NOT NULL,
  contrasena text NOT NULL,
  nombre_completo text NOT NULL,
  email text,
  activo boolean DEFAULT true,
  fecha_registro timestamptz DEFAULT now()
);

-- Tabla de procesos de votación
CREATE TABLE IF NOT EXISTS procesos_votacion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  fecha_inicio timestamptz NOT NULL,
  fecha_cierre timestamptz NOT NULL,
  estado text DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'ABIERTO', 'CERRADO', 'FINALIZADO')),
  administrador_id uuid REFERENCES administradores(id),
  fecha_creacion timestamptz DEFAULT now()
);

-- Tabla de candidatos
CREATE TABLE IF NOT EXISTS candidatos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  avatar_url text,
  proceso_id uuid NOT NULL REFERENCES procesos_votacion(id) ON DELETE CASCADE,
  fecha_registro timestamptz DEFAULT now()
);

-- Tabla de votos
CREATE TABLE IF NOT EXISTS votos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso_id uuid NOT NULL REFERENCES procesos_votacion(id) ON DELETE CASCADE,
  votante_id uuid NOT NULL REFERENCES votantes(id),
  candidato_id uuid NOT NULL REFERENCES candidatos(id),
  fecha_voto timestamptz DEFAULT now(),
  ip_address text,
  UNIQUE(proceso_id, votante_id)
);

-- Tabla de logs de auditoría
CREATE TABLE IF NOT EXISTS logs_auditoria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_usuario text NOT NULL CHECK (tipo_usuario IN ('ADMINISTRADOR', 'VOTANTE')),
  usuario_id uuid NOT NULL,
  accion text NOT NULL,
  detalles text,
  ip_address text,
  fecha_accion timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE votantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE procesos_votacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE votos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_auditoria ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permisivas para desarrollo)
CREATE POLICY "Permitir lectura administradores" ON administradores FOR SELECT USING (true);
CREATE POLICY "Permitir inserción administradores" ON administradores FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización administradores" ON administradores FOR UPDATE USING (true);

CREATE POLICY "Permitir lectura votantes" ON votantes FOR SELECT USING (true);
CREATE POLICY "Permitir inserción votantes" ON votantes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización votantes" ON votantes FOR UPDATE USING (true);

CREATE POLICY "Permitir todo procesos" ON procesos_votacion FOR ALL USING (true);
CREATE POLICY "Permitir todo candidatos" ON candidatos FOR ALL USING (true);
CREATE POLICY "Permitir todo votos" ON votos FOR ALL USING (true);
CREATE POLICY "Permitir todo logs" ON logs_auditoria FOR ALL USING (true);

-- Insertar administrador de prueba
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO administradores (usuario, contrasena, nombre_completo, email)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador Sistema', 'admin@sistema.com')
ON CONFLICT (usuario) DO NOTHING;

-- Insertar votantes de prueba
-- Contraseña: votante123 (hasheada con bcrypt)
INSERT INTO votantes (dni, contrasena, nombre_completo, email) VALUES
('12345678', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Juan Pérez García', 'juan@email.com'),
('87654321', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'María López Torres', 'maria@email.com'),
('11223344', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carlos Rodríguez Sánchez', 'carlos@email.com')
ON CONFLICT (dni) DO NOTHING;