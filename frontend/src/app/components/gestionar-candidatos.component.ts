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
        <button class="btn-back" (click)="volver()">← Volver</button>
        <div>
          <h1>Gestionar Candidatos</h1>
          <p class="proceso-titulo" *ngIf="proceso">{{proceso.titulo}}</p>
        </div>
      </div>

      <div class="content">
        <div class="form-card">
          <h2>Agregar Candidato</h2>
          <form (ngSubmit)="agregarCandidato()" class="form">
            <div class="form-group">
              <label>Nombre Completo *</label>
              <input type="text" [(ngModel)]="nuevoCandidato.nombre" name="nombre" required>
            </div>
            <div class="form-group">
              <label>Descripción / Propuesta</label>
              <textarea [(ngModel)]="nuevoCandidato.descripcion" name="descripcion" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>URL del Avatar</label>
              <input type="url" [(ngModel)]="nuevoCandidato.avatar_url" name="avatar"
                     placeholder="https://ejemplo.com/foto.jpg">
            </div>
            <div class="alert alert-error" *ngIf="error">{{error}}</div>
            <button type="submit" class="btn-primary" [disabled]="guardando">
              {{guardando ? 'Agregando...' : '➕ Agregar Candidato'}}
            </button>
          </form>
        </div>

        <div class="candidatos-lista">
          <h2>Candidatos Registrados ({{candidatos.length}})</h2>
          <div class="loading" *ngIf="cargando">Cargando...</div>
          <div class="candidatos-grid" *ngIf="!cargando">
            <div class="candidato-card" *ngFor="let candidato of candidatos">
              <img [src]="candidato.avatar_url || 'https://ui-avatars.com/api/?name=' + candidato.nombre"
                   [alt]="candidato.nombre" class="avatar">
              <div class="candidato-info">
                <h3>{{candidato.nombre}}</h3>
                <p>{{candidato.descripcion || 'Sin descripción'}}</p>
              </div>
              <button class="btn-delete" (click)="eliminar(candidato)" title="Eliminar">🗑️</button>
            </div>
            <div class="empty" *ngIf="candidatos.length === 0">
              No hay candidatos registrados aún
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 0 auto; padding: 32px 20px; }
    .header { margin-bottom: 32px; }
    .btn-back { padding: 8px 16px; background: #6c757d; color: white; border: none;
                 border-radius: 6px; cursor: pointer; margin-bottom: 12px; }
    h1 { margin: 0; color: #333; }
    .proceso-titulo { margin: 8px 0 0; color: #666; }
    .content { display: grid; gap: 24px; }
    .form-card, .candidatos-lista { background: white; padding: 24px; border-radius: 12px;
                                     box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h2 { margin: 0 0 20px; color: #333; font-size: 20px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #333; }
    .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #e0e0e0;
                                               border-radius: 6px; font-size: 15px; font-family: inherit; }
    .alert-error { padding: 12px; background: #fee2e2; color: #991b1b; border-radius: 6px; margin-bottom: 16px; }
    .btn-primary { width: 100%; padding: 12px; background: #2563eb; color: white; border: none;
                   border-radius: 6px; font-weight: 600; cursor: pointer; }
    .btn-primary:disabled { opacity: 0.5; }
    .candidatos-grid { display: grid; gap: 16px; }
    .candidato-card { display: flex; align-items: center; gap: 16px; padding: 16px;
                      border: 2px solid #e0e0e0; border-radius: 8px; transition: all 0.3s; }
    .candidato-card:hover { border-color: #2563eb; box-shadow: 0 2px 8px rgba(37,99,235,0.1); }
    .avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
    .candidato-info { flex: 1; }
    .candidato-info h3 { margin: 0 0 4px; color: #333; font-size: 16px; }
    .candidato-info p { margin: 0; color: #666; font-size: 14px; }
    .btn-delete { padding: 8px 12px; background: #dc3545; color: white; border: none;
                  border-radius: 6px; cursor: pointer; }
    .empty { text-align: center; padding: 40px; color: #999; }
    .loading { text-align: center; padding: 20px; color: #666; }
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
