import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ProcesoVotacion, Candidato } from '../models/models';
import { AuditoriaService } from './auditoria.service';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  constructor(
    private supabase: SupabaseService,
    private auditoria: AuditoriaService
  ) {}

  async crearProceso(proceso: Partial<ProcesoVotacion>, usuarioId?: string, usuarioEmail?: string): Promise<{ success: boolean; data?: ProcesoVotacion; error?: string }> {
    try {
      const { data, error } = await this.supabase.client
        .from('procesos_votacion')
        .insert([proceso])
        .select()
        .single();

      if (error) throw error;

      if (usuarioId && usuarioEmail) {
        await this.auditoria.registrarCreacionProceso(usuarioId, usuarioEmail, data);
      }

      return { success: true, data: data as ProcesoVotacion };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async obtenerProcesos(adminId?: string): Promise<ProcesoVotacion[]> {
    try {
      let query = this.supabase.client
        .from('procesos_votacion')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (adminId) {
        query = query.eq('administrador_id', adminId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const procesos = data as ProcesoVotacion[];

      // Actualizar estados automáticamente según fechas y candidatos
      for (const proceso of procesos) {
        await this.actualizarEstadoAutomatico(proceso);
      }

      // Volver a obtener los procesos con estados actualizados
      const { data: datosActualizados } = await query;
      return datosActualizados as ProcesoVotacion[];
    } catch (error) {
      console.error('Error al obtener procesos:', error);
      return [];
    }
  }

  private async actualizarEstadoAutomatico(proceso: ProcesoVotacion): Promise<void> {
    try {
      const ahora = new Date();
      const fechaInicio = new Date(proceso.fecha_inicio);
      const fechaCierre = new Date(proceso.fecha_cierre);
      let nuevoEstado = proceso.estado;

      // Verificar si hay al menos 2 candidatos
      const candidatos = await this.obtenerCandidatos(proceso.id);
      const tieneCandidatos = candidatos.length >= 2;

      if (proceso.estado === 'PENDIENTE' && ahora >= fechaInicio && ahora < fechaCierre && tieneCandidatos) {
        nuevoEstado = 'ABIERTO';
      } else if (proceso.estado === 'ABIERTO' && ahora >= fechaCierre) {
        nuevoEstado = 'CERRADO';
      } else if (proceso.estado === 'PENDIENTE' && ahora >= fechaInicio && !tieneCandidatos) {
        // Se mantiene PENDIENTE si no hay suficientes candidatos
        nuevoEstado = 'PENDIENTE';
      }

      // Solo actualizar si cambió el estado
      if (nuevoEstado !== proceso.estado) {
        await this.actualizarEstado(proceso.id, nuevoEstado);
      }
    } catch (error) {
      console.error('Error al actualizar estado automático:', error);
    }
  }

  async obtenerProceso(id: string): Promise<ProcesoVotacion | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('procesos_votacion')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      const proceso = data as ProcesoVotacion;
      if (proceso) {
        await this.actualizarEstadoAutomatico(proceso);

        // Volver a obtener el proceso actualizado
        const { data: procesoActualizado } = await this.supabase.client
          .from('procesos_votacion')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        return procesoActualizado as ProcesoVotacion;
      }

      return proceso;
    } catch (error) {
      console.error('Error al obtener proceso:', error);
      return null;
    }
  }

  async actualizarEstado(id: string, estado: string, usuarioId?: string, usuarioEmail?: string, estadoAnterior?: string, tituloProces?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.client
        .from('procesos_votacion')
        .update({ estado })
        .eq('id', id);

      if (!error && usuarioId && usuarioEmail && estadoAnterior && tituloProces) {
        await this.auditoria.registrarCambioEstadoProceso(usuarioId, usuarioEmail, id, estadoAnterior, estado, tituloProces);
      }

      return !error;
    } catch (error) {
      return false;
    }
  }

  async agregarCandidato(candidato: Partial<Candidato>, usuarioId?: string, usuarioEmail?: string, tituloProces?: string): Promise<{ success: boolean; data?: Candidato; error?: string }> {
    try {
      const { data, error } = await this.supabase.client
        .from('candidatos')
        .insert([candidato])
        .select()
        .single();

      if (error) throw error;

      if (usuarioId && usuarioEmail && tituloProces) {
        await this.auditoria.registrarCreacionCandidato(usuarioId, usuarioEmail, data, tituloProces);
      }

      return { success: true, data: data as Candidato };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async obtenerCandidatos(procesoId: string): Promise<Candidato[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('candidatos')
        .select('*')
        .eq('proceso_id', procesoId)
        .order('fecha_registro', { ascending: true });

      if (error) throw error;
      return data as Candidato[];
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      return [];
    }
  }

  async eliminarCandidato(id: string, usuarioId?: string, usuarioEmail?: string, candidatoData?: any): Promise<boolean> {
    try {
      if (candidatoData && usuarioId && usuarioEmail) {
        await this.auditoria.registrarEliminacionCandidato(usuarioId, usuarioEmail, candidatoData);
      }

      const { error } = await this.supabase.client
        .from('candidatos')
        .delete()
        .eq('id', id);

      return !error;
    } catch (error) {
      return false;
    }
  }

  async actualizarProceso(id: string, datos: Partial<ProcesoVotacion>, usuarioId?: string, usuarioEmail?: string, datosAnteriores?: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.client
        .from('procesos_votacion')
        .update(datos)
        .eq('id', id);

      if (error) throw error;

      if (datosAnteriores && usuarioId && usuarioEmail) {
        await this.auditoria.registrarEdicionProceso(usuarioId, usuarioEmail, id, datosAnteriores, datos);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async eliminarProceso(id: string, usuarioId?: string, usuarioEmail?: string, procesoData?: any): Promise<boolean> {
    try {
      if (procesoData && usuarioId && usuarioEmail) {
        await this.auditoria.registrarEliminacionProceso(usuarioId, usuarioEmail, procesoData);
      }

      const { error } = await this.supabase.client
        .from('procesos_votacion')
        .delete()
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error al eliminar proceso:', error);
      return false;
    }
  }
}
