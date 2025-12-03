import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuditoriaService, LogAuditoria } from '../services/auditoria.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logs-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <button class="btn-back" (click)="volver()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <div class="header-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <h1>Logs de Auditoría</h1>
        </div>
      </div>

      <div class="filtros">
        <div class="filtro-grupo">
          <label>Acción:</label>
          <select [(ngModel)]="filtros.accion" (change)="aplicarFiltros()">
            <option value="">Todas</option>
            <option value="CREAR">Crear</option>
            <option value="EDITAR">Editar</option>
            <option value="ELIMINAR">Eliminar</option>
            <option value="VOTAR">Votar</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="ABRIR_PROCESO">Abrir Proceso</option>
            <option value="CERRAR_PROCESO">Cerrar Proceso</option>
          </select>
        </div>

        <div class="filtro-grupo">
          <label>Entidad:</label>
          <select [(ngModel)]="filtros.entidad" (change)="aplicarFiltros()">
            <option value="">Todas</option>
            <option value="PROCESO">Proceso</option>
            <option value="CANDIDATO">Candidato</option>
            <option value="VOTO">Voto</option>
            <option value="USUARIO">Usuario</option>
            <option value="SISTEMA">Sistema</option>
          </select>
        </div>

        <div class="filtro-grupo">
          <label>Límite:</label>
          <select [(ngModel)]="filtros.limit" (change)="aplicarFiltros()">
            <option [value]="50">50</option>
            <option [value]="100">100</option>
            <option [value]="200">200</option>
            <option [value]="500">500</option>
          </select>
        </div>

        <button class="btn-refrescar" (click)="cargarLogs()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refrescar
        </button>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-label">Total de Logs</div>
            <div class="stat-value">{{logs.length}}</div>
          </div>
        </div>
      </div>

      <div class="logs-list" *ngIf="!cargando">
        <div class="log-item" *ngFor="let log of logs"
             [class.log-crear]="log.accion === 'CREAR'"
             [class.log-editar]="log.accion === 'EDITAR'"
             [class.log-eliminar]="log.accion === 'ELIMINAR'"
             [class.log-votar]="log.accion === 'VOTAR'">
          <div class="log-header">
            <div class="log-accion">
              <span class="badge" [class]="'badge-' + log.accion.toLowerCase()">
                {{getIconoAccion(log.accion)}} {{log.accion}}
              </span>
              <span class="badge badge-entidad">{{log.entidad}}</span>
            </div>
            <div class="log-fecha">{{formatearFecha(log.created_at!)}}</div>
          </div>

          <div class="log-body">
            <p class="log-descripcion">{{log.descripcion}}</p>
            <div class="log-detalles">
              <div class="detalle-item">
                <strong>Usuario:</strong> {{log.usuario_email}}
              </div>
              <div class="detalle-item" *ngIf="log.ip_address">
                <strong>IP:</strong> {{log.ip_address}}
              </div>
            </div>

            <div class="log-datos" *ngIf="log.datos_anteriores || log.datos_nuevos">
              <details>
                <summary>Ver datos</summary>
                <div class="datos-container">
                  <div class="datos-col" *ngIf="log.datos_anteriores">
                    <h4>Datos Anteriores:</h4>
                    <pre>{{formatearJSON(log.datos_anteriores)}}</pre>
                  </div>
                  <div class="datos-col" *ngIf="log.datos_nuevos">
                    <h4>Datos Nuevos:</h4>
                    <pre>{{formatearJSON(log.datos_nuevos)}}</pre>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div class="empty" *ngIf="logs.length === 0">
          No hay logs de auditoría registrados
        </div>
      </div>

      <div class="loading" *ngIf="cargando">Cargando logs...</div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%);
      padding: var(--spacing-8) var(--spacing-6);
    }

    .header {
      max-width: 1200px;
      margin: 0 auto var(--spacing-6);
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      background: var(--color-gray-600);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-6);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-sm);
    }

    .btn-back:hover {
      background: var(--color-gray-700);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .header-title svg {
      color: var(--color-primary-600);
      filter: drop-shadow(0 4px 6px rgba(102, 126, 234, 0.3));
    }

    h1 {
      margin: 0;
      color: var(--color-gray-900);
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
    }

    .filtros {
      max-width: 1200px;
      margin: 0 auto var(--spacing-6);
      background: white;
      padding: var(--spacing-6);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      display: flex;
      gap: var(--spacing-4);
      flex-wrap: wrap;
      align-items: flex-end;
    }

    .filtro-grupo {
      flex: 1;
      min-width: 160px;
    }

    .filtro-grupo label {
      display: block;
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-2);
      color: var(--color-gray-700);
      font-size: var(--font-size-sm);
    }

    .filtro-grupo select {
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      border: 2px solid var(--color-gray-200);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      background: var(--color-gray-50);
      transition: all var(--transition-base);
      cursor: pointer;
    }

    .filtro-grupo select:focus {
      outline: none;
      border-color: var(--color-primary-500);
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn-refrescar {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-5);
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-md);
    }

    .btn-refrescar:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .stats {
      max-width: 1200px;
      margin: 0 auto var(--spacing-6);
    }

    .stat-card {
      background: white;
      padding: var(--spacing-6);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      display: flex;
      align-items: center;
      gap: var(--spacing-5);
      border-top: 4px solid var(--color-primary-500);
      transition: all var(--transition-base);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-2xl);
    }

    .stat-icon {
      color: var(--color-primary-600);
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--color-gray-600);
      margin-bottom: var(--spacing-1);
      font-weight: var(--font-weight-medium);
    }

    .stat-value {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary-600);
    }

    .logs-list {
      max-width: 1200px;
      margin: 0 auto;
    }

    .log-item {
      background: white;
      padding: var(--spacing-5);
      margin-bottom: var(--spacing-4);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      border-left: 4px solid var(--color-gray-400);
      transition: all var(--transition-base);
    }

    .log-item:hover {
      box-shadow: var(--shadow-xl);
      transform: translateX(4px);
    }

    .log-crear {
      border-left-color: var(--color-success-500);
      background: linear-gradient(to right, rgba(16, 185, 129, 0.03) 0%, white 100%);
    }

    .log-editar {
      border-left-color: var(--color-primary-500);
      background: linear-gradient(to right, rgba(102, 126, 234, 0.03) 0%, white 100%);
    }

    .log-eliminar {
      border-left-color: var(--color-error-500);
      background: linear-gradient(to right, rgba(239, 68, 68, 0.03) 0%, white 100%);
    }

    .log-votar {
      border-left-color: #f59e0b;
      background: linear-gradient(to right, rgba(245, 158, 11, 0.03) 0%, white 100%);
    }

    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-3);
    }

    .log-accion {
      display: flex;
      gap: var(--spacing-2);
      flex-wrap: wrap;
    }

    .badge {
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-crear {
      background: var(--color-success-100);
      color: var(--color-success-700);
    }

    .badge-editar {
      background: var(--color-primary-100);
      color: var(--color-primary-700);
    }

    .badge-eliminar {
      background: var(--color-error-100);
      color: var(--color-error-700);
    }

    .badge-votar {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-login {
      background: var(--color-primary-100);
      color: var(--color-primary-700);
    }

    .badge-logout {
      background: var(--color-gray-200);
      color: var(--color-gray-700);
    }

    .badge-abrir_proceso {
      background: var(--color-success-100);
      color: var(--color-success-700);
    }

    .badge-cerrar_proceso {
      background: var(--color-error-100);
      color: var(--color-error-700);
    }

    .badge-entidad {
      background: var(--color-gray-100);
      color: var(--color-gray-700);
    }

    .log-fecha {
      font-size: var(--font-size-xs);
      color: var(--color-gray-500);
      font-weight: var(--font-weight-medium);
    }

    .log-body {
      color: var(--color-gray-700);
    }

    .log-descripcion {
      margin: 0 0 var(--spacing-3) 0;
      color: var(--color-gray-900);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
    }

    .log-detalles {
      display: flex;
      gap: var(--spacing-6);
      flex-wrap: wrap;
      font-size: var(--font-size-sm);
      color: var(--color-gray-600);
    }

    .detalle-item {
      display: flex;
      gap: var(--spacing-2);
    }

    .detalle-item strong {
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-700);
    }

    .log-datos {
      margin-top: var(--spacing-4);
      padding-top: var(--spacing-4);
      border-top: 1px solid var(--color-gray-200);
    }

    .log-datos details {
      cursor: pointer;
    }

    .log-datos summary {
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary-600);
      padding: var(--spacing-2) 0;
      transition: color var(--transition-base);
    }

    .log-datos summary:hover {
      color: var(--color-primary-700);
    }

    .datos-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--spacing-4);
      margin-top: var(--spacing-3);
    }

    .datos-col h4 {
      margin: 0 0 var(--spacing-2) 0;
      color: var(--color-gray-700);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    .datos-col pre {
      background: var(--color-gray-50);
      padding: var(--spacing-3);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-xs);
      overflow-x: auto;
      margin: 0;
      border: 1px solid var(--color-gray-200);
      color: var(--color-gray-800);
      line-height: var(--line-height-relaxed);
    }

    .empty {
      text-align: center;
      padding: var(--spacing-20) var(--spacing-6);
      color: var(--color-gray-500);
      font-size: var(--font-size-lg);
    }

    .loading {
      text-align: center;
      padding: var(--spacing-20) var(--spacing-6);
      color: var(--color-gray-600);
      font-size: var(--font-size-lg);
    }

    @media (max-width: 1024px) {
      .filtros {
        flex-direction: column;
      }

      .filtro-grupo {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: var(--spacing-6) var(--spacing-4);
      }

      .filtros,
      .stats,
      .log-item {
        padding: var(--spacing-4);
      }

      .log-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-2);
      }

      .datos-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LogsAuditoriaComponent implements OnInit {
  logs: LogAuditoria[] = [];
  cargando = true;
  filtros = {
    accion: '',
    entidad: '',
    limit: 100
  };

  constructor(
    private auditoria: AuditoriaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarLogs();
  }

  async cargarLogs() {
    this.cargando = true;
    const filtrosAplicados: any = {
      limit: this.filtros.limit
    };

    if (this.filtros.accion) filtrosAplicados.accion = this.filtros.accion;
    if (this.filtros.entidad) filtrosAplicados.entidad = this.filtros.entidad;

    this.logs = await this.auditoria.obtenerLogs(filtrosAplicados);
    this.cargando = false;
  }

  aplicarFiltros() {
    this.cargarLogs();
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Lima'
    });
  }

  formatearJSON(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  getIconoAccion(accion: string): string {
    const iconos: any = {
      'CREAR': '➕',
      'EDITAR': '✏️',
      'ELIMINAR': '🗑️',
      'VOTAR': '🗳️',
      'LOGIN': '🔐',
      'LOGOUT': '🚪',
      'ABRIR_PROCESO': '🔓',
      'CERRAR_PROCESO': '🔒'
    };
    return iconos[accion] || '📝';
  }

  volver() {
    this.router.navigate(['/admin/dashboard']);
  }
}
