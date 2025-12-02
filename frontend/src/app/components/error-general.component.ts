import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-general',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h1 class="error-code">Error</h1>
        <h2 class="error-title">{{ errorTitle }}</h2>
        <p class="error-message">{{ errorMessage }}</p>

        <div class="error-details" *ngIf="errorDetails">
          <details>
            <summary>Detalles técnicos</summary>
            <pre>{{ errorDetails }}</pre>
          </details>
        </div>

        <div class="error-actions">
          <button class="btn-primary" (click)="irInicio()">
            🏠 Ir al Inicio
          </button>
          <button class="btn-secondary" (click)="recargar()">
            🔄 Recargar Página
          </button>
          <button class="btn-secondary" (click)="volver()">
            ← Volver Atrás
          </button>
        </div>
      </div>
      <div class="error-illustration">
        <div class="warning-triangle">
          <div class="warning-line"></div>
          <div class="warning-line"></div>
          <div class="warning-dot"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .error-content {
      text-align: center;
      color: white;
      z-index: 10;
      max-width: 700px;
    }

    .error-icon {
      font-size: 80px;
      margin-bottom: 20px;
      animation: pulse 2s ease-in-out infinite;
    }

    .error-code {
      font-size: 72px;
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
      margin-bottom: 30px;
      opacity: 0.95;
      line-height: 1.6;
    }

    .error-details {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 30px;
      backdrop-filter: blur(10px);
      text-align: left;
    }

    .error-details summary {
      cursor: pointer;
      font-weight: 600;
      margin-bottom: 10px;
      user-select: none;
    }

    .error-details pre {
      margin: 10px 0 0 0;
      padding: 12px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      font-size: 12px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 14px 28px;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .btn-primary {
      background: white;
      color: #f5576c;
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
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.1;
    }

    .warning-triangle {
      width: 300px;
      height: 300px;
      position: relative;
      animation: rotate 20s linear infinite;
    }

    .warning-line {
      position: absolute;
      width: 8px;
      height: 150px;
      background: white;
      border-radius: 4px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .warning-line:nth-child(2) {
      transform: translate(-50%, -50%) rotate(60deg);
    }

    .warning-dot {
      position: absolute;
      width: 30px;
      height: 30px;
      background: white;
      border-radius: 50%;
      bottom: 30%;
      left: 50%;
      transform: translateX(-50%);
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .error-code {
        font-size: 56px;
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
export class ErrorGeneralComponent implements OnInit {
  errorTitle = 'Algo salió mal';
  errorMessage = 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
  errorDetails = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['title']) {
        this.errorTitle = params['title'];
      }
      if (params['message']) {
        this.errorMessage = params['message'];
      }
      if (params['details']) {
        this.errorDetails = params['details'];
      }
    });
  }

  irInicio() {
    this.router.navigate(['/login']);
  }

  recargar() {
    window.location.reload();
  }

  volver() {
    window.history.back();
  }
}
