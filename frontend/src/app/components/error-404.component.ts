import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">🔍</div>
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Página no encontrada</h2>
        <p class="error-message">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div class="error-actions">
          <button class="btn-primary" (click)="irInicio()">
            🏠 Ir al Inicio
          </button>
          <button class="btn-secondary" (click)="volver()">
            ← Volver Atrás
          </button>
        </div>
      </div>
      <div class="error-illustration">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .error-content {
      text-align: center;
      color: white;
      z-index: 10;
      max-width: 600px;
    }

    .error-icon {
      font-size: 80px;
      margin-bottom: 20px;
      animation: float 3s ease-in-out infinite;
    }

    .error-code {
      font-size: 120px;
      font-weight: 900;
      margin: 0;
      line-height: 1;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .error-title {
      font-size: 32px;
      font-weight: 700;
      margin: 20px 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .error-message {
      font-size: 18px;
      margin-bottom: 40px;
      opacity: 0.9;
      line-height: 1.6;
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 14px 32px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .error-illustration {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .circle:nth-child(1) {
      width: 300px;
      height: 300px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .circle:nth-child(2) {
      width: 200px;
      height: 200px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .circle:nth-child(3) {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
      }
    }

    @media (max-width: 768px) {
      .error-code {
        font-size: 80px;
      }

      .error-title {
        font-size: 24px;
      }

      .error-message {
        font-size: 16px;
      }

      .error-actions {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class Error404Component {
  constructor(private router: Router) {}

  irInicio() {
    this.router.navigate(['/login']);
  }

  volver() {
    window.history.back();
  }
}
