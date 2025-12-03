import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProcesoService } from '../services/proceso.service';

@Component({
  selector: 'app-crear-proceso',
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
        <h1>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="url(#grad1)"/>
            <line x1="9" y1="9" x2="15" y2="9" stroke="url(#grad1)"/>
            <line x1="9" y1="13" x2="15" y2="13" stroke="url(#grad1)"/>
            <line x1="9" y1="17" x2="12" y2="17" stroke="url(#grad1)"/>
            <defs>
              <linearGradient id="grad1" x1="3" y1="4" x2="21" y2="22">
                <stop offset="0%" stop-color="#667eea"/>
                <stop offset="100%" stop-color="#764ba2"/>
              </linearGradient>
            </defs>
          </svg>
          Crear Nuevo Proceso de Votación
        </h1>
      </div>

      <form (ngSubmit)="crear()" class="form">
        <div class="form-group">
          <label>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Título del Proceso *
          </label>
          <input type="text" [(ngModel)]="proceso.titulo" name="titulo" required
                 placeholder="Ej: Elección de Delegado 2024">
        </div>

        <div class="form-group">
          <label>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Descripción
          </label>
          <textarea [(ngModel)]="proceso.descripcion" name="descripcion" rows="4"
                    placeholder="Describe el proceso de votación..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
              </svg>
              Fecha de Inicio *
            </label>
            <input type="datetime-local" [(ngModel)]="proceso.fecha_inicio" name="fecha_inicio" required>
          </div>

          <div class="form-group">
            <label>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <path d="M17 14l-5 5-3-3"/>
              </svg>
              Fecha de Cierre *
            </label>
            <input type="datetime-local" [(ngModel)]="proceso.fecha_cierre" name="fecha_cierre" required>
          </div>
        </div>

        <div class="alert alert-error" *ngIf="error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{error}}
        </div>
        
        <div class="alert alert-success" *ngIf="success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{success}}
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="volver()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancelar
          </button>
          <button type="submit" class="btn-primary" [disabled]="guardando">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!guardando">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <div class="spinner-small" *ngIf="guardando"></div>
            {{guardando ? 'Guardando...' : 'Crear Proceso'}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%);
      padding: var(--spacing-8) var(--spacing-6);
    }

    .header {
      max-width: 900px;
      margin: 0 auto var(--spacing-8);
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

    .header h1 {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin: 0;
      color: var(--color-gray-900);
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
    }

    .header h1 svg {
      filter: drop-shadow(0 4px 6px rgba(102, 126, 234, 0.3));
    }

    .form {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: var(--spacing-10);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      border-top: 4px solid transparent;
      border-image: var(--gradient-primary) 1;
    }

    .form-group {
      margin-bottom: var(--spacing-6);
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-3);
      color: var(--color-gray-700);
      font-size: var(--font-size-base);
    }

    .form-group label svg {
      color: var(--color-primary-600);
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      border: 2px solid var(--color-gray-200);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-family: inherit;
      box-sizing: border-box;
      transition: all var(--transition-base);
      background: var(--color-gray-50);
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--color-primary-500);
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 100px;
      line-height: var(--line-height-relaxed);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-6);
    }

    .form-row .form-group {
      margin-bottom: 0;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-6);
      font-weight: var(--font-weight-medium);
      animation: slideDown 0.3s ease-out;
    }

    .alert svg {
      flex-shrink: 0;
    }

    .alert-error {
      background: var(--color-error-50);
      color: var(--color-error-700);
      border: 1px solid var(--color-error-200);
    }

    .alert-success {
      background: var(--color-success-50);
      color: var(--color-success-700);
      border: 1px solid var(--color-success-200);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-3);
      justify-content: flex-end;
      margin-top: var(--spacing-8);
      padding-top: var(--spacing-8);
      border-top: 2px solid var(--color-gray-100);
    }

    .btn-primary,
    .btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-6);
      border: none;
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
      cursor: pointer;
      transition: all var(--transition-base);
      min-width: 140px;
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: var(--color-gray-100);
      color: var(--color-gray-700);
      border: 2px solid var(--color-gray-200);
    }

    .btn-secondary:hover {
      background: var(--color-gray-200);
      border-color: var(--color-gray-300);
    }

    .spinner-small {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .form {
        padding: var(--spacing-6);
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class CrearProcesoComponent {
  proceso = {
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_cierre: ''
  };
  guardando = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private procesoService: ProcesoService,
    private router: Router
  ) {}

  async crear() {
    this.error = '';
    this.success = '';

    if (!this.proceso.titulo || !this.proceso.fecha_inicio || !this.proceso.fecha_cierre) {
      this.error = 'Por favor complete todos los campos obligatorios';
      return;
    }

    if (new Date(this.proceso.fecha_cierre) <= new Date(this.proceso.fecha_inicio)) {
      this.error = 'La fecha de cierre debe ser posterior a la fecha de inicio';
      return;
    }

    this.guardando = true;
    const adminId = this.authService.getUserId();
    const session = this.authService.getSession();
    const adminEmail = session?.user ? (session.user as any).email : '';

    // Convertir fechas locales a ISO para Supabase (mantiene la hora local)
    const fechaInicioISO = new Date(this.proceso.fecha_inicio).toISOString();
    const fechaCierreISO = new Date(this.proceso.fecha_cierre).toISOString();

    const result = await this.procesoService.crearProceso({
      titulo: this.proceso.titulo,
      descripcion: this.proceso.descripcion,
      fecha_inicio: fechaInicioISO,
      fecha_cierre: fechaCierreISO,
      administrador_id: adminId!,
      estado: 'PENDIENTE'
    }, adminId!, adminEmail);

    this.guardando = false;

    if (result.success) {
      this.success = 'Proceso creado exitosamente';
      setTimeout(() => this.router.navigate(['/admin/dashboard']), 1500);
    } else {
      this.error = result.error || 'Error al crear el proceso';
    }
  }

  volver() {
    this.router.navigate(['/admin/dashboard']);
  }
}
