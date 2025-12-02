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
          <h1>Panel de Administrador</h1>
          <div class="header-actions">
            <span class="user-name">{{nombreAdmin}}</span>
            <button class="btn-logout" (click)="logout()">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <main class="content">
        <div class="actions">
          <button class="btn-primary" (click)="irCrearProceso()">
            ➕ Crear Nuevo Proceso
          </button>
          <button class="btn-secondary" (click)="verLogs()">
            📋 Ver Logs de Auditoría
          </button>
        </div>

        <section class="procesos-section">
          <h2>Mis Procesos de Votación</h2>

          <div class="loading" *ngIf="cargando">Cargando procesos...</div>

          <div class="procesos-grid" *ngIf="!cargando">
            <div class="proceso-card" *ngFor="let proceso of procesos" (click)="verProceso(proceso)">
              <div class="proceso-estado" [class]="'estado-' + proceso.estado.toLowerCase()">
                {{proceso.estado}}
              </div>
              <h3>{{proceso.titulo}}</h3>
              <p class="proceso-descripcion">{{proceso.descripcion || 'Sin descripción'}}</p>
              <div class="proceso-fechas">
                <div class="fecha">
                  <span class="label">Inicio:</span>
                  <span class="valor">{{formatearFecha(proceso.fecha_inicio)}}</span>
                </div>
                <div class="fecha">
                  <span class="label">Cierre:</span>
                  <span class="valor">{{formatearFecha(proceso.fecha_cierre)}}</span>
                </div>
              </div>
              <div class="proceso-actions">
                <button class="btn-secondary" (click)="gestionarCandidatos(proceso, $event)">
                  Candidatos
                </button>
                <button class="btn-secondary" (click)="verResultados(proceso, $event)">
                  Resultados
                </button>
              </div>
              <div class="proceso-actions-extra">
                <button class="btn-edit" (click)="editarProceso(proceso, $event)" title="Editar">
                  ✏️ Editar
                </button>
                <button class="btn-delete" (click)="eliminarProceso(proceso, $event)" title="Eliminar">
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            <div class="empty-state" *ngIf="procesos.length === 0">
              <p>No tienes procesos creados</p>
              <button class="btn-primary" (click)="irCrearProceso()">Crear el primero</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f5f5f5;
    }

    .header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h1 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-name {
      color: #666;
      font-weight: 500;
    }

    .btn-logout {
      padding: 8px 16px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-logout:hover {
      background: #c82333;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 20px;
    }

    .actions {
      margin-bottom: 32px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #2563eb;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #6c757d;
    }

    .btn-secondary:hover {
      background: #5a6268;
      transform: translateY(-2px);
    }

    .procesos-section h2 {
      margin-bottom: 24px;
      color: #333;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .procesos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .proceso-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s;
    }

    .proceso-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .proceso-estado {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .estado-pendiente {
      background: #fef3c7;
      color: #92400e;
    }

    .estado-abierto {
      background: #d1fae5;
      color: #065f46;
    }

    .estado-cerrado {
      background: #fee2e2;
      color: #991b1b;
    }

    .estado-finalizado {
      background: #e0e7ff;
      color: #3730a3;
    }

    .proceso-card h3 {
      margin: 0 0 8px;
      color: #333;
      font-size: 20px;
    }

    .proceso-descripcion {
      color: #666;
      font-size: 14px;
      margin-bottom: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .proceso-fechas {
      margin-bottom: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .fecha {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .fecha:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #666;
      font-weight: 500;
    }

    .valor {
      color: #333;
    }

    .proceso-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .btn-secondary {
      flex: 1;
      padding: 8px 16px;
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .proceso-actions-extra {
      display: flex;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px solid #e0e0e0;
    }

    .btn-edit, .btn-delete {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .btn-edit {
      background: #e7f3ff;
      color: #1d4ed8;
    }

    .btn-edit:hover {
      background: #bfdbfe;
    }

    .btn-delete {
      background: #fee2e2;
      color: #dc2626;
    }

    .btn-delete:hover {
      background: #fecaca;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 16px;
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }

      .procesos-grid {
        grid-template-columns: 1fr;
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
