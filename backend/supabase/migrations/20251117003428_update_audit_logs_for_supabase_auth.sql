/*
  # Actualizar tabla de logs de auditoría para Supabase Auth

  ## Descripción
  Esta migración actualiza la tabla logs_auditoria existente para trabajar
  con Supabase Auth en lugar del sistema de autenticación personalizado.

  ## Cambios:
    1. Eliminar columna `tipo_usuario` (ya no necesaria)
    2. Agregar columna `usuario_email` para referencia rápida
    3. Agregar columna `entidad` para clasificar el tipo de recurso afectado
    4. Agregar columna `entidad_id` para el ID del recurso afectado
    5. Agregar columnas `datos_anteriores` y `datos_nuevos` para JSONB
    6. Actualizar columna `usuario_id` para referenciar auth.users
    7. Renombrar `detalles` a `descripcion`
    8. Renombrar `fecha_accion` a `created_at`
    9. Agregar `user_agent` para información del navegador
    10. Crear índices para búsquedas eficientes
    11. Actualizar políticas RLS
*/

-- Eliminar políticas existentes
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can view all logs" ON logs_auditoria;
  DROP POLICY IF EXISTS "Users can view own logs" ON logs_auditoria;
  DROP POLICY IF EXISTS "Authenticated users can insert logs" ON logs_auditoria;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Eliminar índices existentes
DROP INDEX IF EXISTS idx_logs_usuario_id;
DROP INDEX IF EXISTS idx_logs_accion;
DROP INDEX IF EXISTS idx_logs_entidad;
DROP INDEX IF EXISTS idx_logs_created_at;
DROP INDEX IF EXISTS idx_logs_entidad_compuesto;

-- Agregar nuevas columnas si no existen
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs_auditoria' AND column_name = 'usuario_email'
  ) THEN
    ALTER TABLE logs_auditoria ADD COLUMN usuario_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs_auditoria' AND column_name = 'entidad'
  ) THEN
    ALTER TABLE logs_auditoria ADD COLUMN entidad text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs_auditoria' AND column_name = 'entidad_id'
  ) THEN
    ALTER TABLE logs_auditoria ADD COLUMN entidad_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs_auditoria' AND column_name = 'datos_anteriores'
  ) THEN
    ALTER TABLE logs_auditoria ADD COLUMN datos_anteriores jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs_auditoria' AND column_name = 'datos_nuevos'
  ) THEN
    ALTER TABLE logs_auditoria ADD COLUMN datos_nuevos jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs_auditoria' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE logs_auditoria ADD COLUMN user_agent text;
  END IF;
END $$;

-- Renombrar columnas si es necesario
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs_auditoria' AND column_name = 'detalles'
  ) THEN
    ALTER TABLE logs_auditoria RENAME COLUMN detalles TO descripcion;
  END IF;
EXCEPTION
  WHEN undefined_column THEN NULL;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs_auditoria' AND column_name = 'fecha_accion'
  ) THEN
    ALTER TABLE logs_auditoria RENAME COLUMN fecha_accion TO created_at;
  END IF;
EXCEPTION
  WHEN undefined_column THEN NULL;
END $$;

-- Eliminar columna tipo_usuario si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs_auditoria' AND column_name = 'tipo_usuario'
  ) THEN
    ALTER TABLE logs_auditoria DROP COLUMN tipo_usuario;
  END IF;
END $$;

-- Hacer NOT NULL las columnas requeridas
ALTER TABLE logs_auditoria ALTER COLUMN usuario_email SET DEFAULT '';
ALTER TABLE logs_auditoria ALTER COLUMN entidad SET DEFAULT 'SISTEMA';
ALTER TABLE logs_auditoria ALTER COLUMN descripcion SET DEFAULT '';

UPDATE logs_auditoria SET usuario_email = '' WHERE usuario_email IS NULL;
UPDATE logs_auditoria SET entidad = 'SISTEMA' WHERE entidad IS NULL;
UPDATE logs_auditoria SET descripcion = accion WHERE descripcion IS NULL OR descripcion = '';

ALTER TABLE logs_auditoria ALTER COLUMN usuario_email SET NOT NULL;
ALTER TABLE logs_auditoria ALTER COLUMN entidad SET NOT NULL;
ALTER TABLE logs_auditoria ALTER COLUMN descripcion SET NOT NULL;

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_logs_usuario_id ON logs_auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_accion ON logs_auditoria(accion);
CREATE INDEX IF NOT EXISTS idx_logs_entidad ON logs_auditoria(entidad);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs_auditoria(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_entidad_compuesto ON logs_auditoria(entidad, entidad_id);

-- Políticas RLS actualizadas
CREATE POLICY "Admins can view all logs"
  ON logs_auditoria
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administradores
      WHERE administradores.id = usuario_id
    )
  );

CREATE POLICY "Users can view own logs"
  ON logs_auditoria
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM votantes
      WHERE votantes.id = usuario_id
    )
  );

CREATE POLICY "Authenticated users can insert logs"
  ON logs_auditoria
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Comentarios en la tabla
COMMENT ON TABLE logs_auditoria IS 'Registro de auditoría de todas las acciones realizadas en el sistema';
COMMENT ON COLUMN logs_auditoria.accion IS 'Tipo de acción: CREAR, EDITAR, ELIMINAR, VOTAR, LOGIN, LOGOUT, ABRIR_PROCESO, CERRAR_PROCESO';
COMMENT ON COLUMN logs_auditoria.entidad IS 'Tipo de entidad afectada: PROCESO, CANDIDATO, VOTO, USUARIO, SISTEMA';
COMMENT ON COLUMN logs_auditoria.datos_anteriores IS 'Estado anterior de la entidad (para ediciones y eliminaciones)';
COMMENT ON COLUMN logs_auditoria.datos_nuevos IS 'Estado nuevo de la entidad (para creaciones y ediciones)';
