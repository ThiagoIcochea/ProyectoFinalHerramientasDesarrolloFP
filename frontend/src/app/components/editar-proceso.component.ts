import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProcesoService } from '../services/proceso.service';
import { ProcesoVotacion } from '../models/models';

@Component({
  selector: 'app-editar-proceso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <button class="btn-back" (click)="volver()">← Volver</button>
        <h1>Editar Proceso de Votación</h1>
      </div>

      <form (ngSubmit)="guardar()" class="form" *ngIf="proceso">
        <div class="form-group">
          <label>Título del Proceso *</label>
          <input type="text" [(ngModel)]="proceso.titulo" name="titulo" required
                 placeholder="Ej: Elección de Delegado 2024">
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea [(ngModel)]="proceso.descripcion" name="descripcion" rows="4"
                    placeholder="Describe el proceso de votación..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Fecha de Inicio *</label>
            <input type="datetime-local" [(ngModel)]="fechaInicioLocal" name="fecha_inicio" required>
          </div>

          <div class="form-group">
            <label>Fecha de Cierre *</label>
            <input type="datetime-local" [(ngModel)]="fechaCierreLocal" name="fecha_cierre" required>
          </div>
        </div>

        <div class="form-group">
          <label>Estado</label>
          <select [(ngModel)]="proceso.estado" name="estado" class="select-estado">
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="ABIERTO">ABIERTO</option>
            <option value="CERRADO">CERRADO</option>
            <option value="FINALIZADO">FINALIZADO</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{error}}</div>
        <div class="alert alert-success" *ngIf="success">{{success}}</div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="volver()">Cancelar</button>
          <button type="submit" class="btn-primary" [disabled]="guardando">
            {{guardando ? 'Guardando...' : 'Guardar Cambios'}}
          </button>
        </div>
      </form>

      <div class="loading" *ngIf="!proceso">Cargando proceso...</div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 32px 20px; }
    .header { margin-bottom: 32px; }
    .btn-back { padding: 8px 16px; background: #6c757d; color: white; border: none;
                 border-radius: 6px; cursor: pointer; margin-bottom: 16px; }
    .btn-back:hover { background: #5a6268; }
    h1 { margin: 0; color: #333; }
    .form { background: white; padding: 32px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 24px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 10px; color: #333; font-size: 15px; }
    .form-group input, .form-group textarea, .form-group select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 15px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
      outline: none;
      border-color: #2563eb;
    }
    .select-estado {
      cursor: pointer;
      background-color: white;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 24px;
    }
    .form-row .form-group { margin-bottom: 0; }
    .alert { padding: 12px; border-radius: 6px; margin-bottom: 20px; }
    .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .alert-success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    .btn-primary, .btn-secondary { padding: 12px 24px; border: none; border-radius: 6px;
                                     font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn-primary { background: #2563eb; color: white; }
    .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: #e5e7eb; color: #333; }
    .btn-secondary:hover { background: #d1d5db; }
    .loading { text-align: center; padding: 60px; color: #666; }
    @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class EditarProcesoComponent implements OnInit {
  proceso: ProcesoVotacion | null = null;
  procesoOriginal: ProcesoVotacion | null = null;
  fechaInicioLocal = '';
  fechaCierreLocal = '';
  guardando = false;
  error = '';
  success = '';
  procesoId = '';

  constructor(
    private authService: AuthService,
    private procesoService: ProcesoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const session = this.authService.getSession();
    if (!session || session.tipo !== 'ADMINISTRADOR') {
      this.router.navigate(['/login']);
      return;
    }

    this.procesoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.procesoId) {
      await this.cargarProceso();
    }
  }

  async cargarProceso() {
    this.proceso = await this.procesoService.obtenerProceso(this.procesoId);

    if (this.proceso) {
      this.procesoOriginal = { ...this.proceso };
      this.fechaInicioLocal = this.convertirADatetimeLocal(this.proceso.fecha_inicio);
      this.fechaCierreLocal = this.convertirADatetimeLocal(this.proceso.fecha_cierre);
    } else {
      this.error = 'Proceso no encontrado';
    }
  }

  convertirADatetimeLocal(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const tzOffset = fecha.getTimezoneOffset() * 60000;
    const localISOTime = new Date(fecha.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  }

  async guardar() {
    this.error = '';
    this.success = '';

    if (!this.proceso || !this.proceso.titulo || !this.fechaInicioLocal || !this.fechaCierreLocal) {
      this.error = 'Por favor complete todos los campos obligatorios';
      return;
    }

    if (new Date(this.fechaCierreLocal) <= new Date(this.fechaInicioLocal)) {
      this.error = 'La fecha de cierre debe ser posterior a la fecha de inicio';
      return;
    }

    this.guardando = true;

    const adminId = this.authService.getUserId();
    const session = this.authService.getSession();
    const adminEmail = session?.user ? (session.user as any).email : '';

    const fechaInicioISO = new Date(this.fechaInicioLocal).toISOString();
    const fechaCierreISO = new Date(this.fechaCierreLocal).toISOString();

    const datosAnteriores = {
      titulo: this.procesoOriginal?.titulo,
      descripcion: this.procesoOriginal?.descripcion,
      fecha_inicio: this.procesoOriginal?.fecha_inicio,
      fecha_cierre: this.procesoOriginal?.fecha_cierre,
      estado: this.procesoOriginal?.estado
    };

    const result = await this.procesoService.actualizarProceso(this.procesoId, {
      titulo: this.proceso.titulo,
      descripcion: this.proceso.descripcion,
      fecha_inicio: fechaInicioISO,
      fecha_cierre: fechaCierreISO,
      estado: this.proceso.estado
    }, adminId!, adminEmail, datosAnteriores);

    this.guardando = false;

    if (result.success) {
      this.success = 'Proceso actualizado exitosamente';
      setTimeout(() => this.router.navigate(['/admin/dashboard']), 1500);
    } else {
      this.error = result.error || 'Error al actualizar el proceso';
    }
  }

  volver() {
    this.router.navigate(['/admin/dashboard']);
  }
}
