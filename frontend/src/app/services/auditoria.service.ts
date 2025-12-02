import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface LogAuditoria {
  id?: string;
  usuario_id: string;
  usuario_email: string;
  accion: 'CREAR' | 'EDITAR' | 'ELIMINAR' | 'VOTAR' | 'LOGIN' | 'LOGOUT' | 'ABRIR_PROCESO' | 'CERRAR_PROCESO';
  entidad: 'PROCESO' | 'CANDIDATO' | 'VOTO' | 'USUARIO' | 'SISTEMA';
  entidad_id?: string;
  descripcion: string;
  datos_anteriores?: any;
  datos_nuevos?: any;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  constructor(private supabase: SupabaseService) {}

  async registrarLog(log: Omit<LogAuditoria, 'id' | 'created_at' | 'ip_address' | 'user_agent'>): Promise<void> {
    try {
      const ip_address = await this.obtenerIP();
      const user_agent = navigator.userAgent;

      const { error } = await this.supabase.client
        .from('logs_auditoria')
        .insert({
          ...log,
          ip_address,
          user_agent
        });

      if (error) {
        console.error('Error al registrar log de auditoría:', error);
      }
    } catch (error) {
      console.error('Error en registrarLog:', error);
    }
  }

  async registrarCreacionProceso(usuarioId: string, usuarioEmail: string, proceso: any): Promise<void> {
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion: 'CREAR',
      entidad: 'PROCESO',
      entidad_id: proceso.id,
      descripcion: `Proceso de votación creado: ${proceso.titulo}`,
      datos_nuevos: {
        titulo: proceso.titulo,
        descripcion: proceso.descripcion,
        fecha_inicio: proceso.fecha_inicio,
        fecha_cierre: proceso.fecha_cierre,
        estado: proceso.estado
      }
    });
  }

  async registrarEdicionProceso(usuarioId: string, usuarioEmail: string, procesoId: string, datosAnteriores: any, datosNuevos: any): Promise<void> {
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion: 'EDITAR',
      entidad: 'PROCESO',
      entidad_id: procesoId,
      descripcion: `Proceso de votación editado: ${datosNuevos.titulo}`,
      datos_anteriores: datosAnteriores,
      datos_nuevos: datosNuevos
    });
  }

  async registrarEliminacionProceso(usuarioId: string, usuarioEmail: string, proceso: any): Promise<void> {
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion: 'ELIMINAR',
      entidad: 'PROCESO',
      entidad_id: proceso.id,
      descripcion: `Proceso de votación eliminado: ${proceso.titulo}`,
      datos_anteriores: proceso
    });
  }

  async registrarCambioEstadoProceso(usuarioId: string, usuarioEmail: string, procesoId: string, estadoAnterior: string, estadoNuevo: string, tituloProces: string): Promise<void> {
    const accion = estadoNuevo === 'ABIERTO' ? 'ABRIR_PROCESO' : 'CERRAR_PROCESO';
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion,
      entidad: 'PROCESO',
      entidad_id: procesoId,
      descripcion: `Estado del proceso cambiado de ${estadoAnterior} a ${estadoNuevo}: ${tituloProces}`,
      datos_anteriores: { estado: estadoAnterior },
      datos_nuevos: { estado: estadoNuevo }
    });
  }

  async registrarCreacionCandidato(usuarioId: string, usuarioEmail: string, candidato: any, tituloProces: string): Promise<void> {
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion: 'CREAR',
      entidad: 'CANDIDATO',
      entidad_id: candidato.id,
      descripcion: `Candidato agregado: ${candidato.nombre} al proceso ${tituloProces}`,
      datos_nuevos: {
        nombre: candidato.nombre,
        descripcion: candidato.descripcion,
        proceso_id: candidato.proceso_id
      }
    });
  }

  async registrarEdicionCandidato(usuarioId: string, usuarioEmail: string, candidatoId: string, datosAnteriores: any, datosNuevos: any): Promise<void> {
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion: 'EDITAR',
      entidad: 'CANDIDATO',
      entidad_id: candidatoId,
      descripcion: `Candidato editado: ${datosNuevos.nombre}`,
      datos_anteriores: datosAnteriores,
      datos_nuevos: datosNuevos
    });
  }

  async registrarEliminacionCandidato(usuarioId: string, usuarioEmail: string, candidato: any): Promise<void> {
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion: 'ELIMINAR',
      entidad: 'CANDIDATO',
      entidad_id: candidato.id,
      descripcion: `Candidato eliminado: ${candidato.nombre}`,
      datos_anteriores: candidato
    });
  }

  async registrarVoto(usuarioId: string, usuarioEmail: string, votoId: string, candidatoNombre: string, procesoTitulo: string): Promise<void> {
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion: 'VOTAR',
      entidad: 'VOTO',
      entidad_id: votoId,
      descripcion: `Voto registrado para ${candidatoNombre} en ${procesoTitulo}`,
      datos_nuevos: {
        candidato: candidatoNombre,
        proceso: procesoTitulo
      }
    });
  }

  async registrarLogin(usuarioId: string, usuarioEmail: string, rol: string): Promise<void> {
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion: 'LOGIN',
      entidad: 'USUARIO',
      entidad_id: usuarioId,
      descripcion: `Usuario ${rol} inició sesión: ${usuarioEmail}`
    });
  }

  async registrarLogout(usuarioId: string, usuarioEmail: string): Promise<void> {
    await this.registrarLog({
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      accion: 'LOGOUT',
      entidad: 'USUARIO',
      entidad_id: usuarioId,
      descripcion: `Usuario cerró sesión: ${usuarioEmail}`
    });
  }

  async obtenerLogs(filtros?: {
    usuario_id?: string;
    accion?: string;
    entidad?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    limit?: number;
  }): Promise<LogAuditoria[]> {
    try {
      let query = this.supabase.client
        .from('logs_auditoria')
        .select('*')
        .order('created_at', { ascending: false });

      if (filtros?.usuario_id) {
        query = query.eq('usuario_id', filtros.usuario_id);
      }

      if (filtros?.accion) {
        query = query.eq('accion', filtros.accion);
      }

      if (filtros?.entidad) {
        query = query.eq('entidad', filtros.entidad);
      }

      if (filtros?.fecha_desde) {
        query = query.gte('created_at', filtros.fecha_desde);
      }

      if (filtros?.fecha_hasta) {
        query = query.lte('created_at', filtros.fecha_hasta);
      }

      if (filtros?.limit) {
        query = query.limit(filtros.limit);
      } else {
        query = query.limit(100);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error al obtener logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error en obtenerLogs:', error);
      return [];
    }
  }

  private async obtenerIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  }
}
