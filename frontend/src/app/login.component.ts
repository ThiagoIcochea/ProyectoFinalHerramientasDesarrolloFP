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
      <div class="bg-decorations">
        <div class="decoration decoration-1"></div>
        <div class="decoration decoration-2"></div>
        <div class="decoration decoration-3"></div>
      </div>

      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4V17H20V7Z" stroke="url(#gradient1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 11V13" stroke="url(#gradient1)" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="1.5" fill="url(#gradient1)"/>
              <defs>
                <linearGradient id="gradient1" x1="4" y1="7" x2="20" y2="17">
                  <stop offset="0%" stop-color="#667eea"/>
                  <stop offset="100%" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="title">Sistema de Votación</h1>
          <p class="subtitle">Acceso seguro y transparente</p>
        </div>

        <div class="tabs">
          <button
            class="tab"
            [class.active]="tipoUsuario === 'admin'"
            (click)="cambiarTipo('admin')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Administrador</span>
          </button>
          <button
            class="tab"
            [class.active]="tipoUsuario === 'votante'"
            (click)="cambiarTipo('votante')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Votante</span>
          </button>
        </div>

        <form (ngSubmit)="login()" class="login-form">
          <div class="form-group" *ngIf="tipoUsuario === 'admin'">
            <label for="usuario">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              [(ngModel)]="credenciales.usuario"
              placeholder="Ingrese su usuario"
              autocomplete="username"
              required>
          </div>

          <div class="form-group" *ngIf="tipoUsuario === 'votante'">
            <label for="dni">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <path d="M7 8h10M7 12h10M7 16h6"/>
              </svg>
              DNI
            </label>
            <input
              type="text"
              id="dni"
              name="dni"
              [(ngModel)]="credenciales.dni"
              placeholder="Ingrese su DNI"
              maxlength="20"
              autocomplete="username"
              required>
          </div>

          <div class="form-group">
            <label for="password">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Contraseña
            </label>
            <div class="password-input">
              <input
                [type]="mostrarPassword ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="credenciales.password"
                placeholder="Ingrese su contraseña"
                autocomplete="current-password"
                required>
              <button
                type="button"
                class="toggle-password"
                (click)="mostrarPassword = !mostrarPassword"
                aria-label="Mostrar/Ocultar contraseña">
                <svg *ngIf="!mostrarPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg *ngIf="mostrarPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="alert alert-error" *ngIf="error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{{ error }}</p>
          </div>

          <button type="submit" class="btn-login" [disabled]="cargando">
            <span *ngIf="!cargando">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
              </svg>
              Iniciar Sesión
            </span>
            <span *ngIf="cargando" class="loading">
              <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
              </svg>
              Verificando...
            </span>
          </button>
        </form>

        <div class="login-footer">
          <div class="divider">
            <span>Sistema seguro</span>
          </div>
          <p class="footer-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Votación Digital Certificada
          </p>
        </div>
      </div>

      <div class="version">v1.0.0</div>
    </div>
  `,
  styles: [`
    .login-container {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      padding: var(--spacing-6);
      overflow: hidden;
    }

    .bg-decorations {
      position: absolute;
      inset: 0;
      overflow: hidden;
      opacity: 0.1;
    }

    .decoration {
      position: absolute;
      border-radius: 50%;
      background: white;
      animation: float 20s infinite ease-in-out;
    }

    .decoration-1 {
      width: 400px;
      height: 400px;
      top: -200px;
      left: -100px;
      animation-delay: 0s;
    }

    .decoration-2 {
      width: 300px;
      height: 300px;
      bottom: -150px;
      right: -50px;
      animation-delay: 2s;
    }

    .decoration-3 {
      width: 250px;
      height: 250px;
      top: 50%;
      right: 10%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33% { transform: translateY(-30px) rotate(5deg); }
      66% { transform: translateY(15px) rotate(-5deg); }
    }

    .login-card {
      position: relative;
      background: white;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-2xl);
      width: 100%;
      max-width: 460px;
      overflow: hidden;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(10px);
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

    .login-header {
      text-align: center;
      padding: var(--spacing-10) var(--spacing-8) var(--spacing-8);
      background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
      position: relative;
    }

    .login-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--color-primary-200), transparent);
    }

    .logo {
      margin-bottom: var(--spacing-5);
      animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
    }

    .logo svg {
      filter: drop-shadow(0 4px 6px rgba(102, 126, 234, 0.3));
      transition: transform var(--transition-base);
    }

    .logo:hover svg {
      transform: scale(1.05) rotate(5deg);
    }

    .title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-extrabold);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 var(--spacing-2);
      letter-spacing: -0.02em;
    }

    .subtitle {
      color: var(--color-gray-600);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      margin: 0;
    }

    .tabs {
      display: flex;
      background: var(--color-gray-100);
      padding: var(--spacing-1);
      margin: 0 var(--spacing-8);
      border-radius: var(--radius-lg);
      gap: var(--spacing-1);
      position: relative;
    }

    .tab {
      flex: 1;
      padding: var(--spacing-3) var(--spacing-4);
      border: none;
      background: transparent;
      color: var(--color-gray-600);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      position: relative;
    }

    .tab svg {
      transition: transform var(--transition-base);
    }

    .tab:hover:not(.active) {
      color: var(--color-gray-700);
      background: var(--color-gray-50);
    }

    .tab.active {
      background: white;
      color: var(--color-primary-600);
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
    }

    .tab.active svg {
      transform: scale(1.1);
    }

    .login-form {
      padding: var(--spacing-8);
    }

    .form-group {
      margin-bottom: var(--spacing-6);
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-700);
      margin-bottom: var(--spacing-3);
      font-size: var(--font-size-sm);
    }

    .form-group label svg {
      color: var(--color-gray-500);
    }

    .form-group input {
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      border: 2px solid var(--color-gray-200);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      transition: all var(--transition-base);
      font-family: inherit;
      background: var(--color-gray-50);
    }

    .form-group input::placeholder {
      color: var(--color-gray-400);
    }

    .form-group input:hover {
      border-color: var(--color-gray-300);
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      background: white;
      box-shadow: 0 0 0 4px var(--color-primary-50);
    }

    .password-input {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: var(--spacing-3);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--spacing-2);
      color: var(--color-gray-500);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .toggle-password:hover {
      color: var(--color-primary-600);
      background: var(--color-gray-100);
    }

    .alert {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-6);
      font-size: var(--font-size-sm);
      animation: slideDown 0.3s ease-out;
    }

    .alert svg {
      flex-shrink: 0;
    }

    .alert p {
      margin: 0;
      flex: 1;
      font-weight: var(--font-weight-medium);
    }

    .alert-error {
      background: var(--color-error-50);
      color: var(--color-error-700);
      border: 1px solid var(--color-error-200);
    }

    .btn-login {
      width: 100%;
      padding: var(--spacing-4);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      position: relative;
      overflow: hidden;
    }

    .btn-login::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .btn-login:hover:not(:disabled)::before {
      opacity: 1;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .btn-login span {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .loading {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .login-footer {
      background: linear-gradient(to bottom, transparent, var(--color-gray-50));
      padding: var(--spacing-6) var(--spacing-8);
      border-top: 1px solid var(--color-gray-100);
    }

    .divider {
      text-align: center;
      margin-bottom: var(--spacing-4);
      position: relative;
    }

    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: linear-gradient(to right, transparent, var(--color-gray-300), transparent);
    }

    .divider::before { left: 0; }
    .divider::after { right: 0; }

    .divider span {
      background: white;
      padding: 0 var(--spacing-3);
      color: var(--color-gray-500);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .footer-text {
      text-align: center;
      color: var(--color-gray-600);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
    }

    .version {
      position: absolute;
      bottom: var(--spacing-4);
      right: var(--spacing-4);
      color: rgba(255, 255, 255, 0.7);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.1);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
    }

    @media (max-width: 640px) {
      .login-container {
        padding: var(--spacing-4);
      }

      .login-card {
        border-radius: var(--radius-xl);
        max-width: 100%;
      }

      .login-header {
        padding: var(--spacing-8) var(--spacing-6) var(--spacing-6);
      }

      .title {
        font-size: var(--font-size-2xl);
      }

      .tabs,
      .login-form,
      .login-footer {
        padding-left: var(--spacing-6);
        padding-right: var(--spacing-6);
      }

      .tab span {
        font-size: var(--font-size-xs);
      }

      .version {
        bottom: var(--spacing-2);
        right: var(--spacing-2);
      }
    }

    @media (max-width: 380px) {
      .tab span {
        display: none;
      }

      .tab {
        padding: var(--spacing-3);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    @media (prefers-color-scheme: dark) {
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
