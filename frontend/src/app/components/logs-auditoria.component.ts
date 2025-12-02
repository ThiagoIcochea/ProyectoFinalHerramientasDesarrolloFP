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
        <button class="btn-back" (click)="volver()">← Volver</button>
        <h1>📋 Logs de Auditoría</h1>
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

        <button class="btn-refrescar" (click)="cargarLogs()">🔄 Refrescar</button>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
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
    .container { min-height: 100vh; background: #f5f5f5; padding: 32px 20px; }
    .header { max-width: 1200px; margin: 0 auto 24px; }
    .btn-back { padding: 8px 16px; background: #6c757d; color: white; border: none;
                border-radius: 6px; cursor: pointer; margin-bottom: 16px; transition: background 0.3s; }
    .btn-back:hover { background: #5a6268; }
    h1 { margin: 0; color: #333; }

    .filtros { max-width: 1200px; margin: 0 auto 24px; background: white; padding: 20px;
               border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; gap: 16px;
               flex-wrap: wrap; align-items: flex-end; }
    .filtro-grupo { flex: 1; min-width: 150px; }
    .filtro-grupo label { display: block; font-weight: 600; margin-bottom: 8px; color: #555; font-size: 14px; }
    .filtro-grupo select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;
                           font-size: 14px; }
    .btn-refrescar { padding: 10px 20px; background: #2563eb; color: white; border: none;
                     border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
    .btn-refrescar:hover { background: #1d4ed8; }

    .stats { max-width: 1200px; margin: 0 auto 24px; }
    .stat-card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                 display: flex; align-items: center; gap: 20px; }
    .stat-icon { font-size: 48px; }
    .stat-label { font-size: 14px; color: #666; margin-bottom: 8px; }
    .stat-value { font-size: 36px; font-weight: 700; color: #2563eb; }

    .logs-list { max-width: 1200px; margin: 0 auto; }
    .log-item { background: white; padding: 20px; margin-bottom: 16px; border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid #6c757d;
                transition: all 0.3s; }
    .log-item:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.15); transform: translateY(-2px); }
    .log-crear { border-left-color: #10b981; }
    .log-editar { border-left-color: #3b82f6; }
    .log-eliminar { border-left-color: #ef4444; }
    .log-votar { border-left-color: #f59e0b; }

    .log-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .log-accion { display: flex; gap: 8px; flex-wrap: wrap; }
    .badge { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; }
    .badge-crear { background: #d1fae5; color: #065f46; }
    .badge-editar { background: #dbeafe; color: #1e40af; }
    .badge-eliminar { background: #fee2e2; color: #991b1b; }
    .badge-votar { background: #fef3c7; color: #92400e; }
    .badge-login { background: #e0e7ff; color: #3730a3; }
    .badge-logout { background: #f3f4f6; color: #374151; }
    .badge-abrir_proceso { background: #d1fae5; color: #065f46; }
    .badge-cerrar_proceso { background: #fecaca; color: #7f1d1d; }
    .badge-entidad { background: #f3f4f6; color: #374151; }

    .log-fecha { font-size: 12px; color: #666; }
    .log-descripcion { margin: 0 0 12px 0; color: #333; }
    .log-detalles { display: flex; gap: 24px; flex-wrap: wrap; font-size: 14px; color: #666; }
    .detalle-item { display: flex; gap: 6px; }

    .log-datos { margin-top: 16px; }
    .log-datos details { cursor: pointer; }
    .log-datos summary { font-weight: 600; color: #2563eb; padding: 8px 0; }
    .datos-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                       gap: 16px; margin-top: 12px; }
    .datos-col h4 { margin: 0 0 8px 0; color: #555; font-size: 14px; }
    .datos-col pre { background: #f8f9fa; padding: 12px; border-radius: 6px; font-size: 12px;
                     overflow-x: auto; margin: 0; }

    .empty { text-align: center; padding: 60px 20px; color: #666; font-size: 16px; }
    .loading { text-align: center; padding: 60px 20px; color: #666; font-size: 16px; }

    @media (max-width: 768px) {
      .filtros { flex-direction: column; }
      .filtro-grupo { width: 100%; }
      .log-header { flex-direction: column; align-items: flex-start; gap: 8px; }
      .datos-container { grid-template-columns: 1fr; }
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
