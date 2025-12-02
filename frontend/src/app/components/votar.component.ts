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
        <button class="btn-back" (click)="volver()">← Volver</button>
        <div *ngIf="proceso">
          <h1>{{proceso.titulo}}</h1>
          <p class="descripcion">{{proceso.descripcion}}</p>
        </div>
      </div>

      <div class="loading" *ngIf="cargando">Cargando candidatos...</div>

      <div class="candidatos-container" *ngIf="!cargando && !confirmacionVisible">
        <div class="instrucciones">
          <h2>Selecciona tu candidato</h2>
          <p>Haz clic en el candidato de tu preferencia para emitir tu voto</p>
        </div>

        <div class="alert alert-warning" *ngIf="!puedeVotar">
          ⚠️ Este proceso no está disponible para votar en este momento
        </div>

        <div class="candidatos-grid" *ngIf="puedeVotar">
          <div class="candidato-card" *ngFor="let candidato of candidatos"
               (click)="seleccionarCandidato(candidato)"
               [class.seleccionado]="candidatoSeleccionado?.id === candidato.id">
            <img [src]="candidato.avatar_url || 'https://ui-avatars.com/api/?name=' + candidato.nombre + '&size=200'"
                 [alt]="candidato.nombre" class="candidato-avatar">
            <h3>{{candidato.nombre}}</h3>
            <p>{{candidato.descripcion || 'Candidato al proceso de votación'}}</p>
            <div class="btn-seleccionar">Seleccionar</div>
          </div>

          <div class="empty" *ngIf="candidatos.length === 0">
            No hay candidatos registrados para este proceso
          </div>
        </div>
      </div>

      <div class="confirmacion-modal" *ngIf="confirmacionVisible">
        <div class="modal-content">
          <h2>Confirmar Voto</h2>
          <div class="candidato-seleccionado">
            <img [src]="candidatoSeleccionado!.avatar_url || 'https://ui-avatars.com/api/?name=' + candidatoSeleccionado!.nombre"
                 [alt]="candidatoSeleccionado!.nombre">
            <h3>{{candidatoSeleccionado!.nombre}}</h3>
          </div>
          <div class="alerta">
            <strong>⚠️ Importante:</strong>
            <p>Tu voto será registrado de forma definitiva y NO podrá ser modificado posteriormente.</p>
            <p>¿Confirmas tu voto por <strong>{{candidatoSeleccionado!.nombre}}</strong>?</p>
          </div>
          <div class="alert alert-error" *ngIf="error">{{error}}</div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="cancelar()" [disabled]="votando">Cancelar</button>
            <button class="btn-primary" (click)="confirmarVoto()" [disabled]="votando">
              {{votando ? 'Registrando voto...' : '✓ Confirmar Voto'}}
            </button>
          </div>
        </div>
      </div>

      <div class="confirmacion-modal" *ngIf="votoExitoso">
        <div class="modal-content exito">
          <div class="icono-exito">✓</div>
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
          <button class="btn-primary" (click)="volverDashboard()">Volver al Inicio</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { min-height: 100vh; background: #f5f5f5; padding: 32px 20px; }
    .header { max-width: 1200px; margin: 0 auto 32px; }
    .btn-back { padding: 8px 16px; background: #6c757d; color: white; border: none;
                 border-radius: 6px; cursor: pointer; margin-bottom: 16px; }
    h1 { margin: 0; color: #333; }
    .descripcion { margin: 8px 0 0; color: #666; }
    .loading { text-align: center; padding: 40px; color: #666; }
    .candidatos-container { max-width: 1200px; margin: 0 auto; }
    .instrucciones { background: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .instrucciones h2 { margin: 0 0 8px; color: #333; font-size: 22px; }
    .instrucciones p { margin: 0; color: #666; }
    .alert-warning { padding: 16px; background: #fef3c7; color: #92400e; border-radius: 8px;
                      border: 1px solid #fde68a; margin-bottom: 24px; }
    .candidatos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .candidato-card { background: white; border-radius: 12px; padding: 24px; text-align: center;
                       box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.3s;
                       border: 3px solid transparent; }
    .candidato-card:hover { transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                             border-color: #2563eb; }
    .candidato-card.seleccionado { border-color: #10b981; background: #f0fdf4; }
    .candidato-avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; }
    .candidato-card h3 { margin: 0 0 8px; color: #333; font-size: 18px; }
    .candidato-card p { color: #666; font-size: 14px; margin-bottom: 16px; min-height: 40px; }
    .btn-seleccionar { padding: 10px 20px; background: #2563eb; color: white; border-radius: 6px;
                        font-weight: 600; display: inline-block; }
    .candidato-card:hover .btn-seleccionar { background: #1d4ed8; }
    .empty { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; color: #999; }
    .confirmacion-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex;
                           align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-content { background: white; border-radius: 16px; padding: 32px; max-width: 500px; width: 100%;
                      animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); }
                          to { opacity: 1; transform: translateY(0); } }
    .modal-content h2 { margin: 0 0 24px; color: #333; text-align: center; }
    .candidato-seleccionado { text-align: center; margin-bottom: 24px; }
    .candidato-seleccionado img { width: 100px; height: 100px; border-radius: 50%; margin-bottom: 12px; }
    .candidato-seleccionado h3 { margin: 0; color: #333; font-size: 20px; }
    .alerta { background: #fef3c7; padding: 16px; border-radius: 8px; margin-bottom: 20px;
               border-left: 4px solid #f59e0b; }
    .alerta strong { display: block; color: #92400e; margin-bottom: 8px; }
    .alerta p { margin: 4px 0; color: #78350f; font-size: 14px; }
    .alert-error { padding: 12px; background: #fee2e2; color: #991b1b; border-radius: 6px; margin-bottom: 16px; }
    .modal-actions { display: flex; gap: 12px; }
    .btn-primary, .btn-secondary { flex: 1; padding: 12px; border: none; border-radius: 8px;
                                     font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn-primary { background: #2563eb; color: white; }
    .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: #e5e7eb; color: #333; }
    .modal-content.exito { text-align: center; }
    .icono-exito { width: 80px; height: 80px; background: #10b981; color: white; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; font-size: 48px;
                    margin: 0 auto 24px; }
    .info-voto { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: left; }
    .info-item { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .info-item:last-child { margin-bottom: 0; }
    .label { color: #666; font-weight: 500; }
    .valor { color: #333; font-weight: 600; }
    .estado-confirmado { color: #10b981; }
    @media (max-width: 768px) {
      .candidatos-grid { grid-template-columns: 1fr; }
      .modal-content { padding: 24px; }
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
