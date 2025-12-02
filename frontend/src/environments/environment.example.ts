// Archivo de ejemplo para configuración de environment
//
// Instrucciones:
// 1. Copia este archivo y renómbralo a: environment.ts
// 2. Reemplaza los valores con tus credenciales de Supabase
// 3. Para obtener tus credenciales:
//    - Ve a https://supabase.com/dashboard
//    - Abre tu proyecto
//    - Ve a Settings → API
//    - Copia el Project URL y el anon public key

export const environment = {
  production: false,  // Cambia a false para desarrollo local
  supabase: {
    url: 'https://tu-proyecto.supabase.co',
    key: 'tu-anon-public-key-muy-larga-aqui'
  }
};
