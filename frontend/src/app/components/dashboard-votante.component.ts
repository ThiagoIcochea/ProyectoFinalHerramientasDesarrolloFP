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
          <div class="header-left">
            <div class="logo-section">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4V17H20V7Z" stroke="url(#grad1)" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="12" r="1.5" fill="url(#grad1)"/>
                <defs>
                  <linearGradient id="grad1" x1="4" y1="7" x2="20" y2="17">
                    <stop offset="0%" stop-color="#667eea"/>
                    <stop offset="100%" stop-color="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1>Procesos de Votación</h1>
              <p class="header-subtitle">Panel del Votante</p>
            </div>
          </div>
          <div class="header-actions">
            <div class="user-info">
              <div class="user-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span class="user-name">{{nombreVotante}}</span>
            </div>
            <button class="btn-logout" (click)="logout()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main class="content">
        <div class="loading-container" *ngIf="cargando">
          <div class="spinner"></div>
          <p>Cargando procesos...</p>
        </div>

        <div *ngIf="!cargando">
          <section class="procesos-section" *ngIf="procesosAbiertos.length > 0">
            <div class="section-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" fill="#10b981" opacity="0.2"/>
                <circle cx="12" cy="12" r="4" fill="#10b981"/>
              </svg>
              <h2>Procesos Abiertos</h2>
              <span class="badge-count">{{procesosAbiertos.length}}</span>
            </div>
            <div class="procesos-grid">
              <div class="proceso-card abierto" *ngFor="let proceso of procesosAbiertos"
                   (click)="irAVotar(proceso)">
                <div class="proceso-header">
                  <div class="proceso-estado estado-abierto">
                    <span class="estado-dot"></span>
                    ABIERTO
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
                <h3>{{proceso.titulo}}</h3>
                <p class="descripcion">{{proceso.descripcion}}</p>
                <div class="proceso-fechas">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>Cierra: {{formatearFecha(proceso.fecha_cierre)}}</span>
                </div>
                <button class="btn-votar" (click)="irAVotar(proceso); $event.stopPropagation()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  Votar Ahora
                </button>
              </div>
            </div>
          </section>

          <section class="procesos-section" *ngIf="procesosVotados.length > 0">
            <div class="section-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="#2563eb" stroke-width="2"/>
              </svg>
              <h2>Ya Votaste</h2>
              <span class="badge-count">{{procesosVotados.length}}</span>
            </div>
            <div class="procesos-grid">
              <div class="proceso-card votado" *ngFor="let proceso of procesosVotados">
                <div class="proceso-header">
                  <div class="proceso-estado estado-votado">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    VOTADO
                  </div>
                </div>
                <h3>{{proceso.titulo}}</h3>
                <p class="descripcion">{{proceso.descripcion}}</p>
                <button class="btn-resultados" (click)="verResultados(proceso, $event)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  Ver Resultados
                </button>
              </div>
            </div>
          </section>

          <section class="procesos-section" *ngIf="procesosCerrados.length > 0">
            <div class="section-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" stroke-width="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" stroke-width="2"/>
              </svg>
              <h2>Procesos Cerrados</h2>
              <span class="badge-count">{{procesosCerrados.length}}</span>
            </div>
            <div class="procesos-grid">
              <div class="proceso-card cerrado" *ngFor="let proceso of procesosCerrados">
                <div class="proceso-header">
                  <div class="proceso-estado estado-cerrado">
                    <span class="estado-dot"></span>
                    CERRADO
                  </div>
                </div>
                <h3>{{proceso.titulo}}</h3>
                <p class="descripcion">{{proceso.descripcion}}</p>
                <button class="btn-resultados" (click)="verResultados(proceso, $event)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  Ver Resultados
                </button>
              </div>
            </div>
          </section>

          <div class="empty-state" *ngIf="procesosAbiertos.length === 0 && procesosVotados.length === 0 && procesosCerrados.length === 0">
            <div class="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M20 7H4V17H20V7Z"/>
                <circle cx="12" cy="12" r="1.5"/>
              </svg>
            </div>
            <h3>No hay procesos disponibles</h3>
            <p>Por el momento no hay procesos de votación activos</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: linear-gradient(to bottom, var(--color-gray-50), var(--color-gray-100));
    }

    .header {
      background: white;
      border-bottom: 1px solid var(--color-gray-200);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
      backdrop-filter: blur(10px);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--spacing-6);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-4);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .logo-section svg {
      filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
    }

    .header h1 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-gray-900);
      margin: 0;
      line-height: 1;
    }

    .header-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-gray-600);
      margin: var(--spacing-1) 0 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-2) var(--spacing-4);
      background: var(--color-gray-100);
      border-radius: var(--radius-full);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .user-name {
      color: var(--color-gray-700);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      background: var(--color-error-500);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-sm);
    }

    .btn-logout:hover {
      background: var(--color-error-600);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .content {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--spacing-8) var(--spacing-6);
    }

    .loading-container {
      text-align: center;
      padding: var(--spacing-20) var(--spacing-6);
      animation: fadeIn 0.3s ease-out;
    }

    .loading-container .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--color-gray-200);
      border-top-color: var(--color-primary-600);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto var(--spacing-4);
    }

    .loading-container p {
      color: var(--color-gray-600);
      font-size: var(--font-size-base);
      margin: 0;
    }

    .procesos-section {
      margin-bottom: var(--spacing-12);
      animation: slideUp 0.5s ease-out;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-6);
    }

    .section-header h2 {
      font-size: var(--font-size-2xl);
      color: var(--color-gray-900);
      margin: 0;
      font-weight: var(--font-weight-bold);
      flex: 1;
    }

    .badge-count {
      padding: var(--spacing-1) var(--spacing-3);
      background: var(--color-primary-100);
      color: var(--color-primary-700);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
    }

    .procesos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: var(--spacing-6);
    }

    .proceso-card {
      background: white;
      border-radius: var(--radius-2xl);
      padding: var(--spacing-6);
      box-shadow: var(--shadow-md);
      transition: all var(--transition-base);
      border: 2px solid transparent;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .proceso-card.abierto {
      border-left: 4px solid var(--color-success-500);
      cursor: pointer;
    }

    .proceso-card.abierto:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--color-success-500);
    }

    .proceso-card.votado {
      border-left: 4px solid var(--color-primary-500);
    }

    .proceso-card.cerrado {
      border-left: 4px solid var(--color-error-500);
      opacity: 0.9;
    }

    .proceso-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .proceso-estado {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .estado-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .estado-abierto {
      background: var(--color-success-50);
      color: var(--color-success-700);
      border: 1px solid var(--color-success-200);
    }

    .estado-abierto .estado-dot {
      background: var(--color-success-500);
    }

    .estado-votado {
      background: var(--color-primary-50);
      color: var(--color-primary-700);
      border: 1px solid var(--color-primary-200);
    }

    .estado-cerrado {
      background: var(--color-error-50);
      color: var(--color-error-700);
      border: 1px solid var(--color-error-200);
    }

    .estado-cerrado .estado-dot {
      background: var(--color-error-500);
    }

    .proceso-card h3 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-gray-900);
      margin: 0;
      line-height: var(--line-height-tight);
    }

    .descripcion {
      color: var(--color-gray-600);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .proceso-fechas {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3);
      background: var(--color-warning-50);
      border-radius: var(--radius-lg);
      color: var(--color-warning-700);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .proceso-fechas svg {
      color: var(--color-warning-600);
      flex-shrink: 0;
    }

    .btn-votar, .btn-resultados {
      width: 100%;
      padding: var(--spacing-3);
      border: none;
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
    }

    .btn-votar {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
    }

    .btn-votar::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .btn-votar:hover::before {
      opacity: 1;
    }

    .btn-votar:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-votar svg, .btn-resultados svg {
      position: relative;
      z-index: 1;
    }

    .btn-resultados {
      background: var(--color-gray-600);
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .btn-resultados:hover {
      background: var(--color-gray-700);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-20) var(--spacing-6);
      background: white;
      border-radius: var(--radius-2xl);
      border: 2px dashed var(--color-gray-200);
      animation: fadeIn 0.5s ease-out;
    }

    .empty-icon {
      margin-bottom: var(--spacing-6);
      color: var(--color-gray-300);
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: var(--font-size-xl);
      color: var(--color-gray-900);
      margin: 0 0 var(--spacing-3);
    }

    .empty-state p {
      color: var(--color-gray-600);
      font-size: var(--font-size-base);
      margin: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @media (max-width: 1024px) {
      .procesos-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .header-left {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
      }

      .user-info {
        justify-content: center;
        width: 100%;
      }

      .btn-logout {
        width: 100%;
        justify-content: center;
      }

      .content {
        padding: var(--spacing-6) var(--spacing-4);
      }

      .procesos-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-wrap: wrap;
      }
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
