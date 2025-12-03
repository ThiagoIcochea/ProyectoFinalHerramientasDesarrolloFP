import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcesoService } from '../services/proceso.service';
import { AuthService } from '../services/auth.service';
import { Candidato, ProcesoVotacion } from '../models/models';

@Component({
  selector: 'app-gestionar-candidatos',
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
        <div class="header-content">
          <h1>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="url(#grad1)"/>
              <circle cx="9" cy="7" r="4" stroke="url(#grad1)"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="url(#grad1)"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#grad1)"/>
              <defs>
                <linearGradient id="grad1" x1="2" y1="3" x2="23" y2="21">
                  <stop offset="0%" stop-color="#667eea"/>
                  <stop offset="100%" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
            Gestionar Candidatos
          </h1>
          <p class="proceso-titulo" *ngIf="proceso">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="9" y1="9" x2="15" y2="9"/>
              <line x1="9" y1="13" x2="15" y2="13"/>
              <line x1="9" y1="17" x2="12" y2="17"/>
            </svg>
            {{proceso.titulo}}
          </p>
        </div>
      </div>

      <div class="content">
        <div class="form-card">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Agregar Candidato
          </h2>
          <form (ngSubmit)="agregarCandidato()" class="form">
            <div class="form-group">
              <label>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Nombre Completo *
              </label>
              <input type="text" [(ngModel)]="nuevoCandidato.nombre" name="nombre" 
                     placeholder="Ej: María González" required>
            </div>
            <div class="form-group">
              <label>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Descripción / Propuesta
              </label>
              <textarea [(ngModel)]="nuevoCandidato.descripcion" name="descripcion" rows="3"
                        placeholder="Describe su propuesta o perfil..."></textarea>
            </div>
            <div class="form-group">
              <label>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                URL del Avatar
              </label>
              <input type="url" [(ngModel)]="nuevoCandidato.avatar_url" name="avatar"
                     placeholder="https://ejemplo.com/foto.jpg">
            </div>
            <div class="alert alert-error" *ngIf="error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{error}}
            </div>
            <button type="submit" class="btn-primary" [disabled]="guardando">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!guardando">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <div class="spinner-small" *ngIf="guardando"></div>
              {{guardando ? 'Agregando...' : 'Agregar Candidato'}}
            </button>
          </form>
        </div>

        <div class="candidatos-lista">
          <div class="lista-header">
            <h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Candidatos Registrados
            </h2>
            <span class="badge-count">{{candidatos.length}}</span>
          </div>
          
          <div class="loading-container" *ngIf="cargando">
            <div class="spinner"></div>
            <p>Cargando candidatos...</p>
          </div>
          
          <div class="candidatos-grid" *ngIf="!cargando">
            <div class="candidato-card" *ngFor="let candidato of candidatos">
              <img [src]="candidato.avatar_url || 'https://ui-avatars.com/api/?name=' + candidato.nombre + '&size=200'"
                   [alt]="candidato.nombre" class="avatar">
              <div class="candidato-info">
                <h3>{{candidato.nombre}}</h3>
                <p>{{candidato.descripcion || 'Sin descripción'}}</p>
              </div>
              <button class="btn-delete" (click)="eliminar(candidato)" title="Eliminar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
            
            <div class="empty-state" *ngIf="candidatos.length === 0">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p>No hay candidatos registrados aún</p>
              <span>Utiliza el formulario de arriba para agregar el primer candidato</span>
            </div>
          </div>
        </div>
      </div>
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

    .header-content h1 {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin: 0 0 var(--spacing-2);
      color: var(--color-gray-900);
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
    }

    .header-content h1 svg {
      filter: drop-shadow(0 4px 6px rgba(102, 126, 234, 0.3));
    }

    .proceso-titulo {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin: 0;
      color: var(--color-gray-600);
      font-size: var(--font-size-base);
    }

    .proceso-titulo svg {
      color: var(--color-primary-600);
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: var(--spacing-6);
    }

    .form-card,
    .candidatos-lista {
      background: white;
      padding: var(--spacing-8);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
    }

    h2 {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin: 0 0 var(--spacing-6);
      color: var(--color-gray-900);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
    }

    h2 svg {
      color: var(--color-primary-600);
    }

    .form-group {
      margin-bottom: var(--spacing-5);
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-2);
      color: var(--color-gray-700);
      font-size: var(--font-size-sm);
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
      line-height: var(--line-height-relaxed);
    }

    .alert-error {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      background: var(--color-error-50);
      color: var(--color-error-700);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-5);
      border: 1px solid var(--color-error-200);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .alert-error svg {
      flex-shrink: 0;
    }

    .btn-primary {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-6);
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
      cursor: pointer;
      transition: all var(--transition-base);
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

    .lista-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-6);
    }

    .lista-header h2 {
      margin: 0;
    }

    .badge-count {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      padding: 0 var(--spacing-3);
      background: var(--gradient-primary);
      color: white;
      border-radius: var(--radius-full);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-lg);
      box-shadow: var(--shadow-md);
    }

    .loading-container {
      text-align: center;
      padding: var(--spacing-16) var(--spacing-6);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--color-gray-200);
      border-top-color: var(--color-primary-600);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto var(--spacing-4);
    }

    .spinner-small {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .loading-container p {
      color: var(--color-gray-600);
      font-size: var(--font-size-base);
      margin: 0;
    }

    .candidatos-grid {
      display: grid;
      gap: var(--spacing-4);
    }

    .candidato-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      border: 2px solid var(--color-gray-200);
      border-radius: var(--radius-xl);
      transition: all var(--transition-base);
      background: var(--color-gray-50);
    }

    .candidato-card:hover {
      border-color: var(--color-primary-300);
      background: white;
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid white;
      box-shadow: var(--shadow-md);
      flex-shrink: 0;
    }

    .candidato-info {
      flex: 1;
      min-width: 0;
    }

    .candidato-info h3 {
      margin: 0 0 var(--spacing-1);
      color: var(--color-gray-900);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
    }

    .candidato-info p {
      margin: 0;
      color: var(--color-gray-600);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .btn-delete {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-2);
      background: var(--color-error-500);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .btn-delete:hover {
      background: var(--color-error-600);
      transform: scale(1.1);
      box-shadow: var(--shadow-md);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-16) var(--spacing-6);
      color: var(--color-gray-500);
    }

    .empty-state svg {
      color: var(--color-gray-300);
      margin-bottom: var(--spacing-4);
    }

    .empty-state p {
      margin: 0 0 var(--spacing-2);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-600);
    }

    .empty-state span {
      font-size: var(--font-size-sm);
      color: var(--color-gray-500);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .content {
        grid-template-columns: 1fr;
      }

      .form-card {
        order: 1;
      }

      .candidatos-lista {
        order: 2;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: var(--spacing-6) var(--spacing-4);
      }

      .form-card,
      .candidatos-lista {
        padding: var(--spacing-6);
      }

      .lista-header {
        flex-direction: column;
        gap: var(--spacing-3);
        align-items: flex-start;
      }
    }
  `]
})
export class GestionarCandidatosComponent implements OnInit {
  procesoId = '';
  proceso: ProcesoVotacion | null = null;
  candidatos: Candidato[] = [];
  nuevoCandidato = { nombre: '', descripcion: '', avatar_url: '' };
  cargando = true;
  guardando = false;
  error = '';

  constructor(
    private procesoService: ProcesoService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.procesoId = this.route.snapshot.params['id'];
    this.proceso = await this.procesoService.obtenerProceso(this.procesoId);
    await this.cargarCandidatos();
  }

  async cargarCandidatos() {
    this.candidatos = await this.procesoService.obtenerCandidatos(this.procesoId);
    this.cargando = false;
  }

  async agregarCandidato() {
    this.error = '';
    if (!this.nuevoCandidato.nombre) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    this.guardando = true;
    const adminId = this.authService.getUserId();
    const session = this.authService.getSession();
    const adminEmail = session?.user ? (session.user as any).email : '';

    const result = await this.procesoService.agregarCandidato({
      ...this.nuevoCandidato,
      proceso_id: this.procesoId
    }, adminId!, adminEmail, this.proceso?.titulo || 'Proceso');
    this.guardando = false;

    if (result.success) {
      this.nuevoCandidato = { nombre: '', descripcion: '', avatar_url: '' };
      await this.cargarCandidatos();
    } else {
      this.error = result.error || 'Error al agregar candidato';
    }
  }

  async eliminar(candidato: Candidato) {
    if (confirm(`¿Eliminar a ${candidato.nombre}?`)) {
      const adminId = this.authService.getUserId();
      const session = this.authService.getSession();
      const adminEmail = session?.user ? (session.user as any).email : '';

      await this.procesoService.eliminarCandidato(candidato.id, adminId!, adminEmail, candidato);
      await this.cargarCandidatos();
    }
  }

  volver() {
    this.router.navigate(['/admin/dashboard']);
  }
}
