# 🎨 Frontend - Sistema de Votación

Aplicación Angular 20 para el sistema de votación digital.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Configuración

1. Crea el archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://tu-proyecto.supabase.co',
    key: 'tu-anon-key-aqui'
  }
};
```

### Desarrollo

```bash
npm start
```

Abre `http://localhost:4200` en tu navegador.

### Build de Producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/demo/browser/`

## 📦 Scripts Disponibles

- `npm start` - Inicia servidor de desarrollo
- `npm run build` - Crea build de producción
- `ng generate component nombre` - Genera nuevo componente

## 🏗️ Estructura

```
src/
├── app/
│   ├── components/           # Componentes de la UI
│   │   ├── dashboard-admin.component.ts
│   │   ├── dashboard-votante.component.ts
│   │   ├── crear-proceso.component.ts
│   │   ├── editar-proceso.component.ts
│   │   ├── gestionar-candidatos.component.ts
│   │   ├── votar.component.ts
│   │   ├── resultados.component.ts
│   │   ├── logs-auditoria.component.ts
│   │   ├── error-404.component.ts
│   │   └── error-general.component.ts
│   │
│   ├── services/             # Servicios
│   │   ├── auth.service.ts      # Autenticación
│   │   ├── supabase.service.ts  # Cliente Supabase
│   │   ├── proceso.service.ts   # Gestión de procesos
│   │   ├── voto.service.ts      # Sistema de votación
│   │   └── auditoria.service.ts # Logs de auditoría
│   │
│   ├── models/               # Modelos TypeScript
│   │   └── models.ts
│   │
│   ├── app.component.ts      # Componente raíz
│   ├── app.routes.ts         # Configuración de rutas
│   └── login.component.ts    # Componente de login
│
├── environments/             # Variables de entorno
│   └── environment.ts
│
├── global_styles.css         # Estilos globales
├── index.html               # HTML principal
└── main.ts                  # Entry point
```

## 🔧 Tecnologías

- **Angular 20** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Supabase** - Backend as a Service
- **RxJS** - Programación reactiva
- **Angular Router** - Navegación
- **Angular Forms** - Formularios

## 📱 Componentes Principales

### Administrador

- **DashboardAdminComponent**: Panel principal del admin
- **CrearProcesoComponent**: Crear nuevo proceso
- **EditarProcesoComponent**: Editar proceso existente
- **GestionarCandidatosComponent**: Agregar/eliminar candidatos
- **LogsAuditoriaComponent**: Ver logs del sistema
- **ResultadosComponent**: Ver resultados con gráficos

### Votante

- **DashboardVotanteComponent**: Panel principal del votante
- **VotarComponent**: Interfaz de votación
- **ResultadosComponent**: Ver resultados (compartido con admin)

### Comunes

- **LoginComponent**: Autenticación
- **Error404Component**: Página no encontrada
- **ErrorGeneralComponent**: Errores del sistema

## 🎨 Estilos

El proyecto usa CSS puro con variables personalizadas. Los estilos están incluidos en cada componente usando la propiedad `styles`.

### Paleta de Colores

- Primary: `#2563eb` (Azul)
- Success: `#10b981` (Verde)
- Warning: `#f59e0b` (Amarillo)
- Danger: `#ef4444` (Rojo)
- Gray: `#6c757d` (Gris)

## 🔐 Autenticación

El sistema usa autenticación basada en localStorage con dos tipos de usuario:

- **Administrador**: Usuario y contraseña
- **Votante**: DNI y contraseña

## 📡 API (Supabase)

Todos los servicios se comunican con Supabase:

```typescript
// Ejemplo de uso
const { data, error } = await this.supabase.client
  .from('tabla')
  .select('*')
  .eq('campo', valor);
```

## 🐛 Debug

Para ver logs en consola:

```typescript
console.log('Debug:', variable);
```

Para ver errores de Supabase:

```typescript
if (error) {
  console.error('Error de Supabase:', error);
}
```

## 🚀 Deploy

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist/demo/browser
```

### Vercel

```bash
npm run build
vercel --prod
```

### Build Manual

```bash
npm run build
```

Sube el contenido de `dist/demo/browser/` a tu servidor.

## 📝 Notas

- Asegúrate de tener configurado el archivo `_redirects` para el manejo de rutas
- Usa `Ctrl + Shift + R` para limpiar caché del navegador
- Revisa la consola del navegador (F12) para ver errores
