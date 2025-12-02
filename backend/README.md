# 🔧 Backend - Sistema de Votación

Configuración de base de datos y backend usando Supabase.

## 📊 Base de Datos (Supabase)

### Configuración Inicial

1. **Crear proyecto en Supabase**:
   - Ve a [https://supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Guarda la contraseña de la base de datos

2. **Obtener credenciales**:
   - Ve a Settings → API
   - Copia el **Project URL**
   - Copia el **anon public key**

### Migraciones

Las migraciones están en la carpeta `supabase/migrations/`:

#### 1. `20251116185039_create_voting_system_tables.sql`

Crea las tablas principales:
- `administradores` - Usuarios administradores
- `votantes` - Usuarios votantes
- `procesos_votacion` - Procesos electorales
- `candidatos` - Candidatos por proceso
- `votos` - Registros de votos

**Ejecutar en SQL Editor de Supabase:**

```sql
-- Copiar y pegar el contenido del archivo
-- Hacer clic en "Run"
```

#### 2. `20251117003428_update_audit_logs_for_supabase_auth.sql`

Actualiza la tabla de logs de auditoría:
- `logs_auditoria` - Registros de todas las acciones

**Ejecutar en SQL Editor de Supabase:**

```sql
-- Copiar y pegar el contenido del archivo
-- Hacer clic en "Run"
```

## 🗃️ Estructura de Tablas

### administradores

```sql
- id (uuid, PK)
- usuario (text, unique)
- contrasena (text)
- nombre_completo (text)
- email (text, unique)
- activo (boolean)
- fecha_creacion (timestamptz)
```

### votantes

```sql
- id (uuid, PK)
- dni (text, unique)
- contrasena (text)
- nombre_completo (text)
- email (text)
- activo (boolean)
- fecha_registro (timestamptz)
```

### procesos_votacion

```sql
- id (uuid, PK)
- titulo (text)
- descripcion (text)
- fecha_inicio (timestamptz)
- fecha_cierre (timestamptz)
- estado (text: PENDIENTE, ABIERTO, CERRADO, FINALIZADO)
- administrador_id (uuid, FK)
- fecha_creacion (timestamptz)
```

### candidatos

```sql
- id (uuid, PK)
- nombre (text)
- descripcion (text)
- avatar_url (text)
- proceso_id (uuid, FK)
- fecha_registro (timestamptz)
```

### votos

```sql
- id (uuid, PK)
- proceso_id (uuid, FK)
- votante_id (uuid, FK)
- candidato_id (uuid, FK)
- fecha_voto (timestamptz)
- ip_address (text)
```

### logs_auditoria

```sql
- id (uuid, PK)
- usuario_id (uuid)
- usuario_email (text)
- accion (text: CREAR, EDITAR, ELIMINAR, VOTAR, etc)
- entidad (text: PROCESO, CANDIDATO, VOTO, etc)
- entidad_id (uuid)
- descripcion (text)
- datos_anteriores (jsonb)
- datos_nuevos (jsonb)
- ip_address (text)
- user_agent (text)
- created_at (timestamptz)
```

## 🔒 Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas específicas:

### Administradores

- Pueden ver y modificar sus propios datos
- Solo admin puede crear/eliminar otros admins

### Votantes

- Pueden ver sus propios datos
- Solo pueden votar en procesos ABIERTOS
- Un voto por proceso

### Procesos

- Admins pueden crear/editar/eliminar procesos
- Votantes solo ven procesos ABIERTOS
- Resultados visibles según estado

### Candidatos

- Admins pueden agregar/editar/eliminar
- Votantes ven candidatos de procesos activos

### Votos

- Los votos son anónimos
- Solo se puede votar una vez por proceso
- Los detalles del voto no son visibles individualmente

### Logs

- Admins ven todos los logs
- Usuarios ven sus propios logs
- Los logs son inmutables (no se pueden editar/eliminar)

## 📝 Datos de Prueba

### Crear Administrador

```sql
INSERT INTO administradores (usuario, contrasena, nombre_completo, email, activo)
VALUES ('admin', 'admin123', 'Administrador Principal', 'admin@votacion.com', true);
```

### Crear Votantes

```sql
INSERT INTO votantes (dni, contrasena, nombre_completo, email, activo)
VALUES
  ('12345678', 'votante123', 'Juan Pérez', 'juan@example.com', true),
  ('87654321', 'votante123', 'María García', 'maria@example.com', true),
  ('11223344', 'votante123', 'Pedro López', 'pedro@example.com', true);
```

### Crear Proceso de Prueba

```sql
-- Primero obtén el ID del admin
SELECT id FROM administradores WHERE usuario = 'admin';

-- Luego crea el proceso (reemplaza <ADMIN_ID>)
INSERT INTO procesos_votacion (titulo, descripcion, fecha_inicio, fecha_cierre, estado, administrador_id)
VALUES (
  'Elección de Delegado 2024',
  'Proceso de elección del delegado de clase',
  NOW(),
  NOW() + INTERVAL '7 days',
  'ABIERTO',
  '<ADMIN_ID>'
);
```

## 🔍 Consultas Útiles

### Ver todos los procesos

```sql
SELECT * FROM procesos_votacion ORDER BY fecha_creacion DESC;
```

### Ver votantes activos

```sql
SELECT dni, nombre_completo, email FROM votantes WHERE activo = true;
```

### Ver resultados de un proceso

```sql
SELECT
  c.nombre as candidato,
  COUNT(v.id) as votos
FROM candidatos c
LEFT JOIN votos v ON v.candidato_id = c.id
WHERE c.proceso_id = '<PROCESO_ID>'
GROUP BY c.id, c.nombre
ORDER BY votos DESC;
```

### Ver logs recientes

```sql
SELECT
  usuario_email,
  accion,
  entidad,
  descripcion,
  created_at
FROM logs_auditoria
ORDER BY created_at DESC
LIMIT 50;
```

## 🛠️ Mantenimiento

### Backup de Base de Datos

En Supabase:
1. Ve a Settings → Database
2. Haz clic en "Database backups"
3. Los backups automáticos se hacen diariamente

### Restaurar Backup

1. Ve a Settings → Database → Backups
2. Selecciona el backup a restaurar
3. Confirma la restauración

### Limpiar Datos de Prueba

```sql
-- CUIDADO: Esto eliminará todos los datos
DELETE FROM votos;
DELETE FROM candidatos;
DELETE FROM procesos_votacion;
-- No elimines votantes/admins a menos que sea necesario
```

## 📧 Variables de Entorno

El archivo `.env` debe contener:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**IMPORTANTE**: Nunca subas el archivo `.env` al repositorio público.

## 🔐 Seguridad

### Mejores Prácticas

1. **Usa HTTPS siempre en producción**
2. **Habilita RLS en todas las tablas**
3. **Valida datos en el frontend Y backend**
4. **Usa contraseñas hasheadas (bcrypt en producción)**
5. **Limita intentos de login**
6. **Implementa rate limiting**
7. **Monitorea los logs de auditoría**

### Actualizar Contraseñas

```sql
-- Cambiar contraseña de admin
UPDATE administradores
SET contrasena = 'nueva_contraseña'
WHERE usuario = 'admin';

-- Cambiar contraseña de votante
UPDATE votantes
SET contrasena = 'nueva_contraseña'
WHERE dni = '12345678';
```

## 🐛 Troubleshooting

### Error: "relation does not exist"

Las migraciones no se ejecutaron. Ve al SQL Editor y ejecuta las migraciones.

### Error: "RLS policy violation"

Las políticas RLS están bloqueando la operación. Verifica que:
1. El usuario esté autenticado
2. Tenga permisos para esa operación

### Error: "duplicate key value"

Estás intentando insertar un registro con un ID o campo único que ya existe.

## 📊 Monitoreo

En Supabase:
- **Database**: Ve métricas de uso
- **API**: Ve requests por minuto
- **Logs**: Ve errores en tiempo real
- **Reports**: Estadísticas de uso

## 🚀 Escalabilidad

Supabase maneja automáticamente:
- Connection pooling
- Índices optimizados
- Caché de queries
- Backups automáticos

Para escalar más:
1. Actualiza el plan de Supabase
2. Optimiza queries con índices
3. Usa paginación en listas grandes
4. Implementa caché en el frontend
