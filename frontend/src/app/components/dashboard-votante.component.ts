import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProcesoService } from '../services/proceso.service';
import { VotoService } from '../services/voto.service';
import { ProcesoVotacion } from '../models/models';

@Component({
  selector: 'app-dashboard-votante',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <div class="header-content">
          <h1>Procesos de Votación</h1>
          <div class="header-actions">
            <span class="user-name">{{nombreVotante}}</span>
            <button class="btn-logout" (click)="logout()">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <main class="content">
        <div class="loading" *ngIf="cargando">Cargando procesos...</div>

        <div *ngIf="!cargando">
          <section class="procesos-section" *ngIf="procesosAbiertos.length > 0">
            <h2>🟢 Procesos Abiertos - Puedes Votar</h2>
            <div class="procesos-grid">
              <div class="proceso-card abierto" *ngFor="let proceso of procesosAbiertos"
                   (click)="irAVotar(proceso)">
                <div class="proceso-estado">ABIERTO</div>
                <h3>{{proceso.titulo}}</h3>
                <p>{{proceso.descripcion}}</p>
                <div class="proceso-fechas">
                  <small>Cierra: {{formatearFecha(proceso.fecha_cierre)}}</small>
                </div>
                <button class="btn-votar">Votar Ahora</button>
              </div>
            </div>
          </section>

          <section class="procesos-section" *ngIf="procesosVotados.length > 0">
            <h2>✅ Ya Votaste en Estos Procesos</h2>
            <div class="procesos-grid">
              <div class="proceso-card votado" *ngFor="let proceso of procesosVotados">
                <div class="proceso-estado">VOTADO</div>
                <h3>{{proceso.titulo}}</h3>
                <p>{{proceso.descripcion}}</p>
                <button class="btn-resultados" (click)="verResultados(proceso, $event)">
                  Ver Resultados
                </button>
              </div>
            </div>
          </section>

          <section class="procesos-section" *ngIf="procesosCerrados.length > 0">
            <h2>🔴 Procesos Cerrados</h2>
            <div class="procesos-grid">
              <div class="proceso-card cerrado" *ngFor="let proceso of procesosCerrados">
                <div class="proceso-estado">CERRADO</div>
                <h3>{{proceso.titulo}}</h3>
                <p>{{proceso.descripcion}}</p>
                <button class="btn-resultados" (click)="verResultados(proceso, $event)">
                  Ver Resultados
                </button>
              </div>
            </div>
          </section>

          <div class="empty-state" *ngIf="procesosAbiertos.length === 0 && procesosVotados.length === 0 && procesosCerrados.length === 0">
            <h3>No hay procesos de votación disponibles</h3>
            <p>Por el momento no hay procesos activos</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: #f5f5f5; }
    .header { background: white; border-bottom: 1px solid #e0e0e0; padding: 20px;
               box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header-content { max-width: 1200px; margin: 0 auto; display: flex;
                       justify-content: space-between; align-items: center; }
    .header h1 { margin: 0; color: #333; font-size: 24px; }
    .header-actions { display: flex; align-items: center; gap: 16px; }
    .user-name { color: #666; font-weight: 500; }
    .btn-logout { padding: 8px 16px; background: #dc3545; color: white; border: none;
                   border-radius: 6px; cursor: pointer; font-weight: 500; }
    .content { max-width: 1200px; margin: 0 auto; padding: 32px 20px; }
    .loading { text-align: center; padding: 40px; color: #666; }
    .procesos-section { margin-bottom: 40px; }
    .procesos-section h2 { margin-bottom: 20px; color: #333; }
    .procesos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .proceso-card { background: white; border-radius: 12px; padding: 24px;
                     box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.3s; }
    .proceso-card.abierto { border-left: 4px solid #10b981; cursor: pointer; }
    .proceso-card.abierto:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(16,185,129,0.2); }
    .proceso-card.votado { border-left: 4px solid #2563eb; }
    .proceso-card.cerrado { border-left: 4px solid #dc3545; }
    .proceso-estado { display: inline-block; padding: 4px 12px; border-radius: 4px;
                       font-size: 12px; font-weight: 700; margin-bottom: 12px; }
    .abierto .proceso-estado { background: #d1fae5; color: #065f46; }
    .votado .proceso-estado { background: #dbeafe; color: #1e40af; }
    .cerrado .proceso-estado { background: #fee2e2; color: #991b1b; }
    .proceso-card h3 { margin: 0 0 8px; color: #333; font-size: 18px; }
    .proceso-card p { color: #666; font-size: 14px; margin-bottom: 16px; }
    .proceso-fechas { margin-bottom: 16px; color: #999; font-size: 13px; }
    .btn-votar, .btn-resultados { width: 100%; padding: 10px; border: none; border-radius: 6px;
                                   font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn-votar { background: #10b981; color: white; }
    .btn-votar:hover { background: #059669; }
    .btn-resultados { background: #6c757d; color: white; }
    .btn-resultados:hover { background: #5a6268; }
    .empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; }
    .empty-state h3 { color: #333; margin-bottom: 8px; }
    .empty-state p { color: #666; }
    @media (max-width: 768px) {
      .header-content { flex-direction: column; gap: 12px; text-align: center; }
      .procesos-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardVotanteComponent implements OnInit {
  procesosAbiertos: ProcesoVotacion[] = [];
  procesosVotados: ProcesoVotacion[] = [];
  procesosCerrados: ProcesoVotacion[] = [];
  cargando = true;
  nombreVotante = '';

  constructor(
    private authService: AuthService,
    private procesoService: ProcesoService,
    private votoService: VotoService,
    private router: Router
  ) {}

  async ngOnInit() {
    const session = this.authService.getSession();
    if (!session || session.tipo !== 'VOTANTE') {
      this.router.navigate(['/login']);
      return;
    }

    this.nombreVotante = session.user.nombre_completo;
    await this.cargarProcesos();
  }

  async cargarProcesos() {
    const votanteId = this.authService.getUserId()!;
    const todosProcesos = await this.procesoService.obtenerProcesos();

    for (const proceso of todosProcesos) {
      const yaVoto = await this.votoService.verificarVoto(proceso.id, votanteId);

      if (yaVoto) {
        this.procesosVotados.push(proceso);
      } else if (proceso.estado === 'ABIERTO') {
        this.procesosAbiertos.push(proceso);
      } else if (proceso.estado === 'CERRADO' || proceso.estado === 'FINALIZADO') {
        this.procesosCerrados.push(proceso);
      }
    }

    this.cargando = false;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima'
    });
  }

  irAVotar(proceso: ProcesoVotacion) {
    this.router.navigate(['/votante/votar', proceso.id]);
  }

  verResultados(proceso: ProcesoVotacion, event?: Event) {
    if (event) event.stopPropagation();
    this.router.navigate(['/votante/resultados', proceso.id]);
  }

  async logout() {
    await this.authService.logout();
  }
}
