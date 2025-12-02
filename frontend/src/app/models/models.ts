export interface Administrador {
  id: string;
  usuario: string;
  contrasena: string;
  nombre_completo: string;
  email: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface Votante {
  id: string;
  dni: string;
  contrasena: string;
  nombre_completo: string;
  email?: string;
  activo: boolean;
  fecha_registro: string;
}

export interface ProcesoVotacion {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_cierre: string;
  estado: 'PENDIENTE' | 'ABIERTO' | 'CERRADO' | 'FINALIZADO';
  administrador_id: string;
  fecha_creacion: string;
}

export interface Candidato {
  id: string;
  nombre: string;
  descripcion?: string;
  avatar_url?: string;
  proceso_id: string;
  fecha_registro: string;
}

export interface Voto {
  id: string;
  proceso_id: string;
  votante_id: string;
  candidato_id: string;
  fecha_voto: string;
  ip_address?: string;
}

export interface ResultadoVotacion {
  candidato_id: string;
  nombre_candidato: string;
  avatar_url?: string;
  cantidad_votos: number;
  porcentaje: number;
}

export interface SessionData {
  user: Administrador | Votante;
  tipo: 'ADMINISTRADOR' | 'VOTANTE';
}
