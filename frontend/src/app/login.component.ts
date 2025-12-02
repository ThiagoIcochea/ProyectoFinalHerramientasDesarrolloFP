import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4V17H20V7Z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 11V13" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="1.5" fill="#2563eb"/>
            </svg>
          </div>
          <h1>¡Vota Ya!</h1>
          <p class="subtitle">Ingrese sus credenciales para continuar</p>
        </div>

        <div class="tabs">
          <button
            class="tab"
            [class.active]="tipoUsuario === 'admin'"
            (click)="cambiarTipo('admin')">
            Administrador
          </button>
          <button
            class="tab"
            [class.active]="tipoUsuario === 'votante'"
            (click)="cambiarTipo('votante')">
            Votante
          </button>
        </div>

        <form (ngSubmit)="login()" class="login-form">
          <div class="form-group" *ngIf="tipoUsuario === 'admin'">
            <label for="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              [(ngModel)]="credenciales.usuario"
              placeholder="Ingrese su usuario"
              required>
          </div>

          <div class="form-group" *ngIf="tipoUsuario === 'votante'">
            <label for="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              [(ngModel)]="credenciales.dni"
              placeholder="Ingrese su DNI"
              maxlength="20"
              required>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-input">
              <input
                [type]="mostrarPassword ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="credenciales.password"
                placeholder="Ingrese su contraseña"
                required>
              <button
                type="button"
                class="toggle-password"
                (click)="mostrarPassword = !mostrarPassword">
                {{ mostrarPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <div class="alert alert-error" *ngIf="error">
            <span>⚠️</span>
            <p>{{ error }}</p>
          </div>


          <button type="submit" class="btn-login" [disabled]="cargando">
            <span *ngIf="!cargando">Iniciar Sesión</span>
            <span *ngIf="cargando" class="loading">Verificando...</span>
          </button>
        </form>

        <div class="login-footer">
          <p class="footer-text">
            Sistema de Votación Digital 
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 440px;
      overflow: hidden;
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      padding: 40px 40px 30px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .logo {
      margin-bottom: 20px;
    }

    .login-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px;
    }

    .subtitle {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }

    .tabs {
      display: flex;
      background: #f1f5f9;
      padding: 4px;
      margin: 0 40px;
      border-radius: 8px;
      gap: 4px;
    }

    .tab {
      flex: 1;
      padding: 12px;
      border: none;
      background: transparent;
      color: #64748b;
      font-weight: 600;
      font-size: 15px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab:hover {
      color: #475569;
    }

    .tab.active {
      background: white;
      color: #2563eb;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .login-form {
      padding: 30px 40px 40px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .form-group input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .password-input {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 20px;
      padding: 4px;
      opacity: 0.6;
      transition: opacity 0.3s;
    }

    .toggle-password:hover {
      opacity: 1;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .alert span {
      font-size: 18px;
    }

    .alert p {
      margin: 0;
      flex: 1;
    }

    .alert-error {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .alert-success {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .btn-login {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .loading::after {
      content: '';
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .login-footer {
      background: #f8fafc;
      padding: 20px 40px;
      border-top: 1px solid #e2e8f0;
    }

     .login-footer .footer-text{
     text-align:center;
    }

    .demo-info {
      margin-bottom: 16px;
    }

    .demo-title {
      font-weight: 600;
      color: #475569;
      margin-bottom: 12px;
      font-size: 14px;
    }

    .demo-credentials {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .demo-section {
      background: white;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .demo-section strong {
      display: block;
      color: #334155;
      margin-bottom: 6px;
      font-size: 13px;
    }

    .demo-section code {
      display: block;
      background: #f1f5f9;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
      color: #475569;
      margin-top: 4px;
      font-family: 'Courier New', monospace;
    }

    .manual-link {
      display: block;
      text-align: center;
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
      padding: 10px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .manual-link:hover {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 480px) {
      .login-card {
        border-radius: 0;
      }

      .login-header,
      .login-form,
      .login-footer,
      .tabs {
        padding-left: 24px;
        padding-right: 24px;
      }

      .demo-credentials {
        font-size: 12px;
      }
    }
  `]
})
export class LoginComponent {
  tipoUsuario: 'admin' | 'votante' = 'admin';
  mostrarPassword = false;
  cargando = false;
  error = '';
  mensaje = '';

  credenciales = {
    usuario: '',
    dni: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  cambiarTipo(tipo: 'admin' | 'votante') {
    this.tipoUsuario = tipo;
    this.error = '';
    this.mensaje = '';
    this.credenciales = {
      usuario: '',
      dni: '',
      password: ''
    };
  }

  async login() {
    this.error = '';
    this.mensaje = '';

    if (this.tipoUsuario === 'admin') {
      if (!this.credenciales.usuario || !this.credenciales.password) {
        this.error = 'Por favor complete todos los campos';
        return;
      }

      this.cargando = true;
      const result = await this.authService.loginAdmin(
        this.credenciales.usuario,
        this.credenciales.password
      );
      this.cargando = false;

      if (result.success) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.error = result.error || 'Error al iniciar sesión';
      }
    } else {
      if (!this.credenciales.dni || !this.credenciales.password) {
        this.error = 'Por favor complete todos los campos';
        return;
      }

      this.cargando = true;
      const result = await this.authService.loginVotante(
        this.credenciales.dni,
        this.credenciales.password
      );
      this.cargando = false;

      if (result.success) {
        this.router.navigate(['/votante/dashboard']);
      } else {
        this.error = result.error || 'Error al iniciar sesión';
      }
    }
  }
}
