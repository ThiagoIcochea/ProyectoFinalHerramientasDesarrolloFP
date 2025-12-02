import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Voto, ResultadoVotacion } from '../models/models';
import { AuditoriaService } from './auditoria.service';

@Injectable({
  providedIn: 'root'
})
export class VotoService {
  constructor(
    private supabase: SupabaseService,
    private auditoria: AuditoriaService
  ) {}

  async emitirVoto(voto: Partial<Voto>, usuarioEmail?: string, candidatoNombre?: string, procesoTitulo?: string): Promise<{ success: boolean; error?: string; votoId?: string }> {
    try {
      const yaVoto = await this.verificarVoto(voto.proceso_id!, voto.votante_id!);
      if (yaVoto) {
        return { success: false, error: 'Ya has votado en este proceso' };
      }

      const { data, error } = await this.supabase.client
        .from('votos')
        .insert([voto])
        .select()
        .single();

      if (error) throw error;

      if (voto.votante_id && usuarioEmail && candidatoNombre && procesoTitulo) {
        await this.auditoria.registrarVoto(voto.votante_id, usuarioEmail, data.id, candidatoNombre, procesoTitulo);
      }

      return { success: true, votoId: data.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async verificarVoto(procesoId: string, votanteId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.client
        .from('votos')
        .select('id')
        .eq('proceso_id', procesoId)
        .eq('votante_id', votanteId)
        .maybeSingle();

      return !!data;
    } catch (error) {
      return false;
    }
  }

  async obtenerResultados(procesoId: string): Promise<ResultadoVotacion[]> {
    try {
      const candidatos = await this.supabase.client
        .from('candidatos')
        .select('*')
        .eq('proceso_id', procesoId);

      const votos = await this.supabase.client
        .from('votos')
        .select('candidato_id')
        .eq('proceso_id', procesoId);

      if (!candidatos.data || !votos.data) return [];

      const totalVotos = votos.data.length;
      const conteo: { [key: string]: number } = {};

      votos.data.forEach(v => {
        conteo[v.candidato_id] = (conteo[v.candidato_id] || 0) + 1;
      });

      const resultados: ResultadoVotacion[] = candidatos.data.map(c => ({
        candidato_id: c.id,
        nombre_candidato: c.nombre,
        avatar_url: c.avatar_url,
        cantidad_votos: conteo[c.id] || 0,
        porcentaje: totalVotos > 0 ? ((conteo[c.id] || 0) / totalVotos) * 100 : 0
      }));

      return resultados.sort((a, b) => b.cantidad_votos - a.cantidad_votos);
    } catch (error) {
      console.error('Error al obtener resultados:', error);
      return [];
    }
  }

  async obtenerTotalVotos(procesoId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase.client
        .from('votos')
        .select('*', { count: 'exact', head: true })
        .eq('proceso_id', procesoId);

      return count || 0;
    } catch (error) {
      return 0;
    }
  }
}
