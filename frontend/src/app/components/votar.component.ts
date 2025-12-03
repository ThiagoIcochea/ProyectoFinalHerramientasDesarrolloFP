import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProcesoService } from '../services/proceso.service';
import { VotoService } from '../services/voto.service';
import { ProcesoVotacion, Candidato } from '../models/models';

@Component({
  selector: 'app-votar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <button class="btn-back" (click)="volver()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <div *ngIf="proceso" class="header-info">
          <h1>{{proceso.titulo}}</h1>
          <p class="descripcion">{{proceso.descripcion}}</p>
        </div>
      </div>

      <div class="loading-container" *ngIf="cargando">
        <div class="spinner"></div>
        <p>Cargando candidatos...</p>
      </div>

      <div class="candidatos-container" *ngIf="!cargando && !confirmacionVisible">
        <div class="instrucciones">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 7H4V17H20V7Z" stroke="url(#grad2)" stroke-width="2"/>
            <circle cx="12" cy="12" r="1.5" fill="url(#grad2)"/>
            <defs>
              <linearGradient id="grad2" x1="4" y1="7" x2="20" y2="17">
                <stop offset="0%" stop-color="#667eea"/>
                <stop offset="100%" stop-color="#764ba2"/>
              </linearGradient>
            </defs>
          </svg>
          <h2>Selecciona tu candidato</h2>
          <p>Haz clic en el candidato de tu preferencia para emitir tu voto</p>
        </div>

        <div class="alert alert-warning" *ngIf="!puedeVotar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>Este proceso no está disponible para votar en este momento</span>
        </div>

        <div class="candidatos-grid" *ngIf="puedeVotar">
          <div class="candidato-card" *ngFor="let candidato of candidatos"
               (click)="seleccionarCandidato(candidato)"
               [class.seleccionado]="candidatoSeleccionado?.id === candidato.id">
            <div class="candidato-badge" *ngIf="candidatoSeleccionado?.id === candidato.id">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <img [src]="candidato.avatar_url || 'https://ui-avatars.com/api/?name=' + candidato.nombre + '&size=200'"
                 [alt]="candidato.nombre" class="candidato-avatar">
            <h3>{{candidato.nombre}}</h3>
            <p>{{candidato.descripcion || 'Candidato al proceso de votación'}}</p>
            <div class="btn-seleccionar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Seleccionar
            </div>
          </div>

          <div class="empty-state" *ngIf="candidatos.length === 0">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p>No hay candidatos registrados para este proceso</p>
          </div>
        </div>
      </div>

      <div class="confirmacion-modal" *ngIf="confirmacionVisible">
        <div class="modal-backdrop" (click)="cancelar()"></div>
        <div class="modal-content">
          <h2>Confirmar Voto</h2>
          <div class="candidato-seleccionado">
            <img [src]="candidatoSeleccionado!.avatar_url || 'https://ui-avatars.com/api/?name=' + candidatoSeleccionado!.nombre"
                 [alt]="candidatoSeleccionado!.nombre">
            <h3>{{candidatoSeleccionado!.nombre}}</h3>
          </div>
          <div class="alerta">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <strong>Importante</strong>
              <p>Tu voto será registrado de forma definitiva y NO podrá ser modificado posteriormente.</p>
              <p>¿Confirmas tu voto por <strong>{{candidatoSeleccionado!.nombre}}</strong>?</p>
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
          <div class="modal-actions">
            <button class="btn-secondary" (click)="cancelar()" [disabled]="votando">Cancelar</button>
            <button class="btn-primary" (click)="confirmarVoto()" [disabled]="votando">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!votando">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div class="spinner-small" *ngIf="votando"></div>
              {{votando ? 'Registrando voto...' : 'Confirmar Voto'}}
            </button>
          </div>
        </div>
      </div>

      <div class="confirmacion-modal" *ngIf="votoExitoso">
        <div class="modal-content exito">
          <div class="icono-exito">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2>¡Voto Registrado Exitosamente!</h2>
          <p>Tu voto ha sido registrado correctamente en el sistema.</p>
          <div class="info-voto">
            <div class="info-item">
              <span class="label">Proceso:</span>
              <span class="valor">{{proceso?.titulo}}</span>
            </div>
            <div class="info-item">
              <span class="label">Fecha:</span>
              <span class="valor">{{fechaVoto}}</span>
            </div>
            <div class="info-item">
              <span class="label">Estado:</span>
              <span class="valor estado-confirmado">CONFIRMADO</span>
            </div>
          </div>
          <button class="btn-primary" (click)="volverDashboard()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      background: linear-gradient(to bottom, var(--color-gray-50), var(--color-gray-100));
      padding: var(--spacing-8) var(--spacing-6);
    }

    .header {
      max-width: 1400px;
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
      margin-bottom: var(--spacing-4);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-sm);
    }

    .btn-back:hover {
      background: var(--color-gray-700);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .header-info h1 {
      margin: 0;
      color: var(--color-gray-900);
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
    }

    .descripcion {
      margin: var(--spacing-2) 0 0;
      color: var(--color-gray-600);
      font-size: var(--font-size-base);
    }

    .loading-container {
      text-align: center;
      padding: var(--spacing-20) var(--spacing-6);
      animation: fadeIn 0.3s ease-out;
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
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .loading-container p {
      color: var(--color-gray-600);
      font-size: var(--font-size-base);
      margin: 0;
    }

    .candidatos-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .instrucciones {
      background: white;
      padding: var(--spacing-8);
      border-radius: var(--radius-2xl);
      margin-bottom: var(--spacing-8);
      box-shadow: var(--shadow-md);
      text-align: center;
    }

    .instrucciones svg {
      margin-bottom: var(--spacing-4);
      filter: drop-shadow(0 4px 6px rgba(102, 126, 234, 0.3));
    }

    .instrucciones h2 {
      margin: 0 0 var(--spacing-2);
      color: var(--color-gray-900);
      font-size: var(--font-size-2xl);
    }

    .instrucciones p {
      margin: 0;
      color: var(--color-gray-600);
      font-size: var(--font-size-base);
    }

    .alert-warning {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4) var(--spacing-6);
      background: var(--color-warning-50);
      color: var(--color-warning-700);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-warning-200);
      margin-bottom: var(--spacing-8);
      font-weight: var(--font-weight-medium);
    }

    .alert-warning svg {
      flex-shrink: 0;
      color: var(--color-warning-600);
    }

    .candidatos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-6);
    }

    .candidato-card {
      background: white;
      border-radius: var(--radius-2xl);
      padding: var(--spacing-6);
      text-align: center;
      box-shadow: var(--shadow-md);
      cursor: pointer;
      transition: all var(--transition-base);
      border: 3px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .candidato-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-primary);
      opacity: 0;
      transition: opacity var(--transition-base);
      z-index: 0;
    }

    .candidato-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-xl);
      border-color: var(--color-primary-200);
    }

    .candidato-card.seleccionado {
      border-color: var(--color-success-500);
      background: var(--color-success-50);
    }

    .candidato-card.seleccionado::before {
      opacity: 0.05;
    }

    .candidato-badge {
      position: absolute;
      top: var(--spacing-4);
      right: var(--spacing-4);
      width: 40px;
      height: 40px;
      background: var(--color-success-500);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-lg);
      z-index: 1;
      animation: scaleIn 0.3s ease-out;
    }

    .candidato-avatar {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: var(--spacing-4);
      border: 4px solid var(--color-gray-100);
      transition: all var(--transition-base);
      position: relative;
      z-index: 1;
    }

    .candidato-card:hover .candidato-avatar {
      border-color: var(--color-primary-300);
      transform: scale(1.05);
    }

    .candidato-card.seleccionado .candidato-avatar {
      border-color: var(--color-success-400);
    }

    .candidato-card h3 {
      margin: 0 0 var(--spacing-2);
      color: var(--color-gray-900);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      position: relative;
      z-index: 1;
    }

    .candidato-card p {
      color: var(--color-gray-600);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-4);
      min-height: 42px;
      line-height: var(--line-height-normal);
      position: relative;
      z-index: 1;
    }

    .btn-seleccionar {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-6);
      background: var(--gradient-primary);
      color: white;
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
      transition: all var(--transition-base);
      position: relative;
      z-index: 1;
      box-shadow: var(--shadow-md);
    }

    .candidato-card:hover .btn-seleccionar {
      transform: scale(1.05);
      box-shadow: var(--shadow-lg);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-20) var(--spacing-6);
      background: white;
      border-radius: var(--radius-2xl);
      border: 2px dashed var(--color-gray-200);
      color: var(--color-gray-500);
    }

    .empty-state svg {
      color: var(--color-gray-300);
      margin-bottom: var(--spacing-4);
    }

    .confirmacion-modal {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal);
      padding: var(--spacing-6);
    }

    .modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
    }

    .modal-content {
      position: relative;
      background: white;
      border-radius: var(--radius-2xl);
      padding: var(--spacing-8);
      max-width: 520px;
      width: 100%;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: var(--shadow-2xl);
    }

    .modal-content h2 {
      margin: 0 0 var(--spacing-6);
      color: var(--color-gray-900);
      text-align: center;
      font-size: var(--font-size-2xl);
    }

    .candidato-seleccionado {
      text-align: center;
      margin-bottom: var(--spacing-6);
    }

    .candidato-seleccionado img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin-bottom: var(--spacing-3);
      border: 4px solid var(--color-success-200);
      box-shadow: var(--shadow-lg);
    }

    .candidato-seleccionado h3 {
      margin: 0;
      color: var(--color-gray-900);
      font-size: var(--font-size-xl);
    }

    .alerta {
      display: flex;
      gap: var(--spacing-4);
      background: var(--color-warning-50);
      padding: var(--spacing-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-6);
      border-left: 4px solid var(--color-warning-500);
    }

    .alerta svg {
      flex-shrink: 0;
      color: var(--color-warning-600);
    }

    .alerta strong {
      display: block;
      color: var(--color-warning-700);
      margin-bottom: var(--spacing-2);
      font-weight: var(--font-weight-bold);
    }

    .alerta p {
      margin: var(--spacing-1) 0;
      color: var(--color-warning-700);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
    }

    .alert-error {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      background: var(--color-error-50);
      color: var(--color-error-700);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-6);
      border: 1px solid var(--color-error-200);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .alert-error svg {
      flex-shrink: 0;
    }

    .modal-actions {
      display: flex;
      gap: var(--spacing-3);
    }

    .btn-primary, .btn-secondary {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-4);
      border: none;
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
      cursor: pointer;
      transition: all var(--transition-base);
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

    .btn-secondary:hover:not(:disabled) {
      background: var(--color-gray-200);
      border-color: var(--color-gray-300);
    }

    .modal-content.exito {
      text-align: center;
    }

    .icono-exito {
      width: 100px;
      height: 100px;
      background: var(--gradient-primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-6);
      box-shadow: var(--shadow-xl);
      animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .info-voto {
      background: var(--color-gray-50);
      padding: var(--spacing-5);
      border-radius: var(--radius-lg);
      margin: var(--spacing-6) 0;
      text-align: left;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-3);
      padding-bottom: var(--spacing-3);
      border-bottom: 1px solid var(--color-gray-200);
    }

    .info-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .label {
      color: var(--color-gray-600);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-sm);
    }

    .valor {
      color: var(--color-gray-900);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
    }

    .estado-confirmado {
      color: var(--color-success-600);
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
        transform: translateY(40px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .candidatos-grid {
        grid-template-columns: 1fr;
      }

      .modal-content {
        padding: var(--spacing-6);
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class VotarComponent implements OnInit {
  procesoId = '';
  proceso: ProcesoVotacion | null = null;
  candidatos: Candidato[] = [];
  candidatoSeleccionado: Candidato | null = null;
  cargando = true;
  puedeVotar = true;
  confirmacionVisible = false;
  votoExitoso = false;
  votando = false;
  error = '';
  fechaVoto = '';

  constructor(
    private authService: AuthService,
    private procesoService: ProcesoService,
    private votoService: VotoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.procesoId = this.route.snapshot.params['id'];
    this.proceso = await this.procesoService.obtenerProceso(this.procesoId);

    if (!this.proceso || this.proceso.estado !== 'ABIERTO') {
      this.puedeVotar = false;
    }

    const votanteId = this.authService.getUserId()!;
    const yaVoto = await this.votoService.verificarVoto(this.procesoId, votanteId);
    if (yaVoto) {
      this.puedeVotar = false;
      this.error = 'Ya has votado en este proceso';
    }

    this.candidatos = await this.procesoService.obtenerCandidatos(this.procesoId);
    this.cargando = false;
  }

  seleccionarCandidato(candidato: Candidato) {
    this.candidatoSeleccionado = candidato;
    this.confirmacionVisible = true;
    this.error = '';
  }

  cancelar() {
    this.confirmacionVisible = false;
    this.candidatoSeleccionado = null;
  }

  async confirmarVoto() {
    if (!this.candidatoSeleccionado) return;

    this.votando = true;
    this.error = '';

    const session = this.authService.getSession();
    const votanteEmail = session?.user ? ((session.user as any).email || (session.user as any).dni) : '';

    const result = await this.votoService.emitirVoto({
      proceso_id: this.procesoId,
      votante_id: this.authService.getUserId()!,
      candidato_id: this.candidatoSeleccionado.id
    }, votanteEmail, this.candidatoSeleccionado.nombre, this.proceso?.titulo || 'Proceso de votación');

    this.votando = false;

    if (result.success) {
      this.confirmacionVisible = false;
      this.votoExitoso = true;
      this.fechaVoto = new Date().toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Lima'
      });
    } else {
      this.error = result.error || 'Error al registrar el voto';
    }
  }

  volver() {
    this.router.navigate(['/votante/dashboard']);
  }

  volverDashboard() {
    this.router.navigate(['/votante/dashboard']);
  }
}
