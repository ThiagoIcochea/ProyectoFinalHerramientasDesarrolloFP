import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProcesoService } from '../services/proceso.service';
import { ProcesoVotacion } from '../models/models';

@Component({
  selector: 'app-dashboard-admin',
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
              <h1>Panel de Administración</h1>
              <p class="header-subtitle">Gestión de Procesos Electorales</p>
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
              <span class="user-name">{{nombreAdmin}}</span>
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
        <div class="actions-bar">
          <button class="btn-primary btn-icon" (click)="irCrearProceso()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Nuevo Proceso</span>
          </button>
          <button class="btn-secondary btn-icon" (click)="verLogs()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <span>Logs de Auditoría</span>
          </button>
        </div>

        <section class="procesos-section">
          <div class="section-header">
            <h2>Procesos de Votación</h2>
            <div class="stats-mini" *ngIf="!cargando">
              <span class="stat-badge">{{procesos.length}} Total</span>
            </div>
          </div>

          <div class="loading-container" *ngIf="cargando">
            <div class="spinner"></div>
            <p>Cargando procesos...</p>
          </div>

          <div class="procesos-grid" *ngIf="!cargando && procesos.length > 0">
            <div class="proceso-card" *ngFor="let proceso of procesos" (click)="verProceso(proceso)">
              <div class="proceso-header">
                <div class="proceso-estado" [class]="'estado-' + proceso.estado.toLowerCase()">
                  <span class="estado-dot"></span>
                  {{proceso.estado}}
                </div>
                <div class="proceso-menu">
                  <button class="btn-menu" (click)="$event.stopPropagation()" title="Opciones">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>

              <h3 class="proceso-titulo">{{proceso.titulo}}</h3>
              <p class="proceso-descripcion">{{proceso.descripcion || 'Sin descripción disponible'}}</p>

              <div class="proceso-fechas">
                <div class="fecha-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div>
                    <span class="fecha-label">Inicio</span>
                    <span class="fecha-valor">{{formatearFecha(proceso.fecha_inicio)}}</span>
                  </div>
                </div>
                <div class="fecha-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div>
                    <span class="fecha-label">Cierre</span>
                    <span class="fecha-valor">{{formatearFecha(proceso.fecha_cierre)}}</span>
                  </div>
                </div>
              </div>

              <div class="proceso-actions">
                <button class="btn-action" (click)="gestionarCandidatos(proceso, $event)" title="Gestionar candidatos">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>Candidatos</span>
                </button>
                <button class="btn-action" (click)="verResultados(proceso, $event)" title="Ver resultados">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  <span>Resultados</span>
                </button>
              </div>

              <div class="proceso-footer">
                <button class="btn-icon-sm" (click)="editarProceso(proceso, $event)" title="Editar proceso">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="btn-icon-sm danger" (click)="eliminarProceso(proceso, $event)" title="Eliminar proceso">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="!cargando && procesos.length === 0">
            <div class="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
              </svg>
            </div>
            <h3>No hay procesos creados</h3>
            <p>Comienza creando tu primer proceso de votación</p>
            <button class="btn-primary" (click)="irCrearProceso()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Crear Primer Proceso
            </button>
          </div>
        </section>
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
      padding: var(--spacing-6) var(--spacing-6);
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

    .btn-logout:active {
      transform: translateY(0);
    }

    .content {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--spacing-8) var(--spacing-6);
    }

    .actions-bar {
      display: flex;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-8);
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: var(--spacing-3) var(--spacing-6);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-md);
    }

    .btn-icon {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .btn-primary {
      background: var(--gradient-primary);
      position: relative;
      overflow: hidden;
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .btn-primary:hover::before {
      opacity: 1;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-primary span {
      position: relative;
      z-index: 1;
    }

    .btn-secondary {
      background: var(--color-gray-600);
    }

    .btn-secondary:hover {
      background: var(--color-gray-700);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .procesos-section {
      animation: fadeIn 0.5s ease-out;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-6);
      flex-wrap: wrap;
      gap: var(--spacing-4);
    }

    .section-header h2 {
      font-size: var(--font-size-2xl);
      color: var(--color-gray-900);
      margin: 0;
      font-weight: var(--font-weight-bold);
    }

    .stats-mini {
      display: flex;
      gap: var(--spacing-2);
    }

    .stat-badge {
      padding: var(--spacing-2) var(--spacing-4);
      background: var(--color-primary-100);
      color: var(--color-primary-700);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
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

    .procesos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: var(--spacing-6);
      animation: slideUp 0.5s ease-out;
    }

    .proceso-card {
      background: white;
      border-radius: var(--radius-2xl);
      padding: var(--spacing-6);
      box-shadow: var(--shadow-md);
      cursor: pointer;
      transition: all var(--transition-base);
      border: 1px solid var(--color-gray-100);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .proceso-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--color-primary-200);
    }

    .proceso-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
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

    .estado-pendiente {
      background: var(--color-warning-50);
      color: var(--color-warning-700);
      border: 1px solid var(--color-warning-200);
    }

    .estado-pendiente .estado-dot {
      background: var(--color-warning-500);
    }

    .estado-abierto {
      background: var(--color-success-50);
      color: var(--color-success-700);
      border: 1px solid var(--color-success-200);
    }

    .estado-abierto .estado-dot {
      background: var(--color-success-500);
    }

    .estado-cerrado {
      background: var(--color-error-50);
      color: var(--color-error-700);
      border: 1px solid var(--color-error-200);
    }

    .estado-cerrado .estado-dot {
      background: var(--color-error-500);
    }

    .estado-finalizado {
      background: var(--color-primary-50);
      color: var(--color-primary-700);
      border: 1px solid var(--color-primary-200);
    }

    .estado-finalizado .estado-dot {
      background: var(--color-primary-500);
    }

    .proceso-menu {
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .proceso-card:hover .proceso-menu {
      opacity: 1;
    }

    .btn-menu {
      padding: var(--spacing-1);
      background: var(--color-gray-100);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--color-gray-600);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
    }

    .btn-menu:hover {
      background: var(--color-gray-200);
      color: var(--color-gray-900);
    }

    .proceso-titulo {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-gray-900);
      margin: 0;
      line-height: var(--line-height-tight);
    }

    .proceso-descripcion {
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
      flex-direction: column;
      gap: var(--spacing-3);
      padding: var(--spacing-4);
      background: var(--color-gray-50);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-gray-100);
    }

    .fecha-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .fecha-item svg {
      color: var(--color-gray-400);
      flex-shrink: 0;
    }

    .fecha-item > div {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .fecha-label {
      font-size: var(--font-size-xs);
      color: var(--color-gray-500);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .fecha-valor {
      font-size: var(--font-size-sm);
      color: var(--color-gray-900);
      font-weight: var(--font-weight-semibold);
    }

    .proceso-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-2);
    }

    .btn-action {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3);
      background: var(--color-gray-100);
      border: 1px solid var(--color-gray-200);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-700);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-action:hover {
      background: var(--color-primary-50);
      border-color: var(--color-primary-300);
      color: var(--color-primary-700);
      transform: translateY(-1px);
    }

    .btn-action svg {
      transition: transform var(--transition-base);
    }

    .btn-action:hover svg {
      transform: scale(1.1);
    }

    .proceso-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-2);
      padding-top: var(--spacing-4);
      border-top: 1px solid var(--color-gray-100);
    }

    .btn-icon-sm {
      padding: var(--spacing-2);
      background: var(--color-gray-100);
      border: 1px solid var(--color-gray-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--color-gray-600);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
    }

    .btn-icon-sm:hover {
      background: var(--color-primary-50);
      border-color: var(--color-primary-300);
      color: var(--color-primary-700);
      transform: scale(1.05);
    }

    .btn-icon-sm.danger:hover {
      background: var(--color-error-50);
      border-color: var(--color-error-300);
      color: var(--color-error-700);
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
      margin: 0 0 var(--spacing-6);
    }

    .empty-state .btn-primary {
      display: inline-flex;
      margin: 0 auto;
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
        gap: var(--spacing-4);
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

      .actions-bar {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
        justify-content: center;
      }

      .procesos-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 480px) {
      .header h1 {
        font-size: var(--font-size-xl);
      }

      .proceso-actions {
        grid-template-columns: 1fr;
      }

      .proceso-card {
        padding: var(--spacing-5);
      }
    }
  `]
})
export class DashboardAdminComponent implements OnInit {
  procesos: ProcesoVotacion[] = [];
  cargando = true;
  nombreAdmin = '';

  constructor(
    private authService: AuthService,
    private procesoService: ProcesoService,
    private router: Router
  ) {}

  async ngOnInit() {
    const session = this.authService.getSession();
    if (!session || session.tipo !== 'ADMINISTRADOR') {
      this.router.navigate(['/login']);
      return;
    }

    this.nombreAdmin = session.user.nombre_completo;
    await this.cargarProcesos();
  }

  async cargarProcesos() {
    const adminId = this.authService.getUserId();
    if (adminId) {
      this.procesos = await this.procesoService.obtenerProcesos(adminId);
    }
    this.cargando = false;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima'
    });
  }

  irCrearProceso() {
    this.router.navigate(['/admin/crear-proceso']);
  }

  verLogs() {
    this.router.navigate(['/admin/logs']);
  }

  verProceso(proceso: ProcesoVotacion) {
    this.router.navigate(['/admin/editar-proceso', proceso.id]);
  }

  gestionarCandidatos(proceso: ProcesoVotacion, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/admin/candidatos', proceso.id]);
  }

  verResultados(proceso: ProcesoVotacion, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/admin/resultados', proceso.id]);
  }

  editarProceso(proceso: ProcesoVotacion, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/admin/editar-proceso', proceso.id]);
  }

  async eliminarProceso(proceso: ProcesoVotacion, event: Event) {
    event.stopPropagation();

    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar el proceso "${proceso.titulo}"?\n\n` +
      `Esta acción también eliminará:\n` +
      `- Todos los candidatos asociados\n` +
      `- Todos los votos registrados\n` +
      `- Los logs de auditoría\n\n` +
      `Esta acción NO se puede deshacer.`
    );

    if (!confirmacion) return;

    const resultado = await this.procesoService.eliminarProceso(proceso.id);

    if (resultado) {
      alert('Proceso eliminado exitosamente');
      await this.cargarProcesos();
    } else {
      alert('Error al eliminar el proceso. Inténtalo nuevamente.');
    }
  }

  async logout() {
    await this.authService.logout();
  }
}
