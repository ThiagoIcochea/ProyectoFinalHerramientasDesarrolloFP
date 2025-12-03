import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcesoService } from '../services/proceso.service';
import { VotoService } from '../services/voto.service';
import { AuthService } from '../services/auth.service';
import { ProcesoVotacion, ResultadoVotacion } from '../models/models';

@Component({
  selector: 'app-resultados',
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
        <div class="header-content" *ngIf="proceso">
          <h1>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10" stroke="url(#grad1)"/>
              <line x1="12" y1="20" x2="12" y2="4" stroke="url(#grad1)"/>
              <line x1="6" y1="20" x2="6" y2="14" stroke="url(#grad1)"/>
              <defs>
                <linearGradient id="grad1" x1="6" y1="4" x2="18" y2="20">
                  <stop offset="0%" stop-color="#667eea"/>
                  <stop offset="100%" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
            Resultados: {{proceso.titulo}}
          </h1>
          <p class="estado-proceso">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Estado: <span [class]="'badge-' + proceso.estado.toLowerCase()">{{proceso.estado}}</span>
          </p>
        </div>
      </div>

      <div class="loading" *ngIf="cargando">Cargando resultados...</div>

      <div class="resultados-content" *ngIf="!cargando">
        <div class="estadisticas">
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 7H4V17H20V7Z"/>
                <circle cx="12" cy="12" r="1.5"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Total de Votos</div>
              <div class="stat-value">{{totalVotos}}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Candidatos</div>
              <div class="stat-value">{{resultados.length}}</div>
            </div>
          </div>
          <div class="stat-card ganador" *ngIf="resultados.length > 0">
            <div class="stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Ganador</div>
              <div class="stat-value">{{resultados[0].nombre_candidato}}</div>
            </div>
          </div>
        </div>

        <div class="resultados-tabla" *ngIf="resultados.length > 0">
          <h2>Resultados Detallados</h2>
          <div class="resultado-item" *ngFor="let resultado of resultados; let i = index"
               [class.primer-lugar]="i === 0">
            <div class="resultado-header">
              <div class="candidato-info">
                <img [src]="resultado.avatar_url || 'https://ui-avatars.com/api/?name=' + resultado.nombre_candidato"
                     [alt]="resultado.nombre_candidato" class="avatar">
                <div>
                  <h3>
                    <svg *ngIf="i === 0" width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" stroke-width="1" class="medalla">
                      <circle cx="12" cy="12" r="10"/>
                      <text x="12" y="16" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">1</text>
                    </svg>
                    <svg *ngIf="i === 1" width="24" height="24" viewBox="0 0 24 24" fill="#94a3b8" stroke="#64748b" stroke-width="1" class="medalla">
                      <circle cx="12" cy="12" r="10"/>
                      <text x="12" y="16" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">2</text>
                    </svg>
                    <svg *ngIf="i === 2" width="24" height="24" viewBox="0 0 24 24" fill="#fb923c" stroke="#f97316" stroke-width="1" class="medalla">
                      <circle cx="12" cy="12" r="10"/>
                      <text x="12" y="16" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">3</text>
                    </svg>
                    {{resultado.nombre_candidato}}
                  </h3>
                  <div class="resultado-stats">
                    <span class="votos">{{resultado.cantidad_votos}} votos</span>
                    <span class="porcentaje">{{resultado.porcentaje.toFixed(2)}}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="barra-container">
              <div class="barra-progreso" [style.width.%]="resultado.porcentaje"
                   [class.barra-ganador]="i === 0"></div>
            </div>
          </div>

          <div class="empty" *ngIf="totalVotos === 0">
            No se han registrado votos en este proceso
          </div>
        </div>

        <div class="grafico-visual" *ngIf="resultados.length > 0 && totalVotos > 0">
          <h2>Gráfico de Resultados</h2>
          <div class="grafico-barras">
            <div class="barra-item" *ngFor="let resultado of resultados; let i = index">
              <div class="barra-visual">
                <div class="barra-fill"
                     [style.height.%]="calcularAltura(resultado.porcentaje)"
                     [class.barra-gold]="i === 0"
                     [class.barra-silver]="i === 1"
                     [class.barra-bronze]="i === 2">
                  <span class="barra-valor">{{resultado.cantidad_votos}}</span>
                </div>
              </div>
              <div class="barra-label">
                <img [src]="resultado.avatar_url || 'https://ui-avatars.com/api/?name=' + resultado.nombre_candidato"
                     [alt]="resultado.nombre_candidato" class="avatar-mini">
                <span>{{resultado.nombre_candidato}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="acciones" *ngIf="esAdmin">
          <button class="btn-export" (click)="exportarCSV()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar CSV
          </button>
          <button class="btn-export" (click)="exportarPDF()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Exportar PDF
          </button>
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
      margin: 0;
      color: var(--color-gray-900);
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
    }

    .header-content h1 svg {
      filter: drop-shadow(0 4px 6px rgba(102, 126, 234, 0.3));
    }

    .estado-proceso {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin: var(--spacing-2) 0 0;
      color: var(--color-gray-600);
      font-size: var(--font-size-base);
    }

    .estado-proceso svg {
      color: var(--color-primary-600);
    }

    .badge-abierto,
    .badge-cerrado,
    .badge-finalizado,
    .badge-pendiente {
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-abierto {
      background: var(--color-success-100);
      color: var(--color-success-700);
    }

    .badge-cerrado {
      background: var(--color-error-100);
      color: var(--color-error-700);
    }

    .badge-finalizado {
      background: var(--color-gray-200);
      color: var(--color-gray-700);
    }

    .badge-pendiente {
      background: var(--color-warning-100);
      color: var(--color-warning-700);
    }
    .loading {
      text-align: center;
      padding: var(--spacing-16);
      color: var(--color-gray-600);
      font-size: var(--font-size-lg);
    }

    .resultados-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .estadisticas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .stat-card {
      background: white;
      padding: var(--spacing-6);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      transition: all var(--transition-base);
      border-top: 4px solid var(--color-primary-500);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-2xl);
    }

    .stat-card.ganador {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-top-color: #f59e0b;
    }

    .stat-icon {
      color: var(--color-primary-600);
    }

    .stat-card.ganador .stat-icon {
      color: #f59e0b;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      color: var(--color-gray-600);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-1);
      font-weight: var(--font-weight-medium);
    }

    .stat-value {
      color: var(--color-gray-900);
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
    }
    .resultados-tabla {
      background: white;
      padding: var(--spacing-8);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      margin-bottom: var(--spacing-8);
    }

    .resultados-tabla h2 {
      margin: 0 0 var(--spacing-6);
      color: var(--color-gray-900);
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
    }

    .resultado-item {
      margin-bottom: var(--spacing-6);
      padding-bottom: var(--spacing-6);
      border-bottom: 2px solid var(--color-gray-100);
      transition: all var(--transition-base);
    }

    .resultado-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .resultado-item.primer-lugar {
      background: linear-gradient(to right, rgba(254, 243, 199, 0.5) 0%, transparent 100%);
      padding: var(--spacing-4);
      border-radius: var(--radius-xl);
      margin: calc(var(--spacing-2) * -1);
      margin-bottom: var(--spacing-4);
      border: 2px solid #fbbf24;
    }

    .resultado-header {
      margin-bottom: var(--spacing-3);
    }

    .candidato-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
      box-shadow: var(--shadow-lg);
    }

    .candidato-info h3 {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin: 0 0 var(--spacing-2);
      color: var(--color-gray-900);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
    }

    .medalla {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    .resultado-stats {
      display: flex;
      gap: var(--spacing-4);
      align-items: center;
    }

    .votos {
      color: var(--color-gray-600);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
    }

    .porcentaje {
      color: var(--color-primary-600);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-xl);
    }

    .barra-container {
      height: 36px;
      background: var(--color-gray-100);
      border-radius: var(--radius-full);
      overflow: hidden;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .barra-progreso {
      height: 100%;
      background: var(--gradient-primary);
      transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3);
    }

    .barra-progreso.barra-ganador {
      background: linear-gradient(90deg, var(--color-success-500) 0%, var(--color-success-600) 100%);
    }
    .grafico-visual {
      background: white;
      padding: var(--spacing-8);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      margin-bottom: var(--spacing-8);
    }

    .grafico-visual h2 {
      margin: 0 0 var(--spacing-8);
      color: var(--color-gray-900);
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
    }

    .grafico-barras {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 420px;
      padding: var(--spacing-6);
      background: linear-gradient(135deg, var(--color-gray-50) 0%, white 100%);
      border-radius: var(--radius-xl);
      border: 2px solid var(--color-gray-100);
    }

    .barra-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 160px;
    }

    .barra-visual {
      width: 100%;
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .barra-fill {
      width: 70%;
      min-height: 5%;
      background: var(--gradient-primary);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      position: relative;
      transition: height 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: var(--spacing-2);
      box-shadow: 0 -4px 12px rgba(102, 126, 234, 0.3);
    }

    .barra-fill.barra-gold {
      background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
      box-shadow: 0 -4px 12px rgba(251, 191, 36, 0.4);
    }

    .barra-fill.barra-silver {
      background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
      box-shadow: 0 -4px 12px rgba(148, 163, 184, 0.4);
    }

    .barra-fill.barra-bronze {
      background: linear-gradient(180deg, #fb923c 0%, #f97316 100%);
      box-shadow: 0 -4px 12px rgba(251, 146, 60, 0.4);
    }

    .barra-valor {
      color: white;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-lg);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .barra-label {
      margin-top: var(--spacing-3);
      text-align: center;
      width: 100%;
    }

    .avatar-mini {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-bottom: var(--spacing-2);
      border: 3px solid white;
      box-shadow: var(--shadow-md);
    }

    .barra-label span {
      display: block;
      font-size: var(--font-size-xs);
      color: var(--color-gray-700);
      font-weight: var(--font-weight-semibold);
    }

    .empty {
      text-align: center;
      padding: var(--spacing-16);
      color: var(--color-gray-500);
      font-size: var(--font-size-lg);
    }

    .acciones {
      display: flex;
      gap: var(--spacing-4);
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-export {
      display: flex;
      align-items: center;
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

    .btn-export:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    @media (max-width: 1024px) {
      .estadisticas {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: var(--spacing-6) var(--spacing-4);
      }

      .resultados-tabla,
      .grafico-visual {
        padding: var(--spacing-6);
      }

      .grafico-barras {
        height: 320px;
      }

      .barra-item {
        max-width: 90px;
      }

      .barra-label span {
        font-size: 10px;
      }

      .acciones {
        flex-direction: column;
      }

      .btn-export {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ResultadosComponent implements OnInit {
  procesoId = '';
  proceso: ProcesoVotacion | null = null;
  resultados: ResultadoVotacion[] = [];
  totalVotos = 0;
  cargando = true;
  esAdmin = false;

  constructor(
    private procesoService: ProcesoService,
    private votoService: VotoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.esAdmin = this.authService.isAdmin();
    this.procesoId = this.route.snapshot.params['id'];
    this.proceso = await this.procesoService.obtenerProceso(this.procesoId);
    this.resultados = await this.votoService.obtenerResultados(this.procesoId);
    this.totalVotos = await this.votoService.obtenerTotalVotos(this.procesoId);
    this.cargando = false;
  }

  calcularAltura(porcentaje: number): number {
    return Math.max(porcentaje, 5);
  }

  exportarCSV() {
    const csv = this.generarCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `resultados-${this.proceso?.titulo}.csv`);
    link.click();
  }

  private generarCSV(): string {
    let csv = 'Candidato,Votos,Porcentaje\n';
    this.resultados.forEach(r => {
      csv += `"${r.nombre_candidato}",${r.cantidad_votos},${r.porcentaje.toFixed(2)}%\n`;
    });
    csv += `\nTotal de Votos,${this.totalVotos}\n`;
    csv += `Proceso,"${this.proceso?.titulo}"\n`;
    csv += `Estado,${this.proceso?.estado}\n`;
    return csv;
  }

  exportarPDF() {
    const contenido = this.generarHTMLParaImpresion();

    // Remover iframe existente si lo hay
    const iframeExistente = document.getElementById('pdf-print-frame');
    if (iframeExistente) {
      iframeExistente.remove();
    }

    // Crear un iframe oculto
    const iframe = document.createElement('iframe');
    iframe.id = 'pdf-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(contenido);
      iframeDoc.close();

      // Esperar a que el contenido se cargue y luego imprimir
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.print();
        }, 500);
      };

      // Si onload no se dispara, intentar después de un delay
      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.print();
        }
      }, 1000);
    }
  }

  private generarHTMLParaImpresion(): string {
    const fecha = new Date().toLocaleString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima'
    });

    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Resultados - ${this.proceso?.titulo}</title>
      <style>
        @media print { body { margin: 0; } .no-print { display: none; } }
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        h1 { color: #2563eb; margin: 0 0 10px 0; }
        .info { color: #666; margin: 5px 0; }
        .estadisticas { display: flex; justify-content: space-around; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .stat { text-align: center; }
        .stat-label { font-size: 14px; color: #666; margin-bottom: 8px; }
        .stat-value { font-size: 32px; font-weight: bold; color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: 600; }
        td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        tr:nth-child(even) { background: #f8f9fa; }
        .ganador { background: #fef3c7 !important; font-weight: bold; }
        .ganador td:first-child::before { content: '🏆 '; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #666; font-size: 12px; }
        .barra-visual { height: 20px; background: #e0e0e0; border-radius: 4px; overflow: hidden; margin-top: 5px; }
        .barra-fill { height: 100%; background: #2563eb; }
        .barra-ganador { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); }
      </style></head><body>
      <div class="header">
        <h1>RESULTADOS DE VOTACIÓN</h1>
        <div class="info"><strong>${this.proceso?.titulo}</strong></div>
        <div class="info">Estado: ${this.proceso?.estado}</div>
        <div class="info">Generado: ${fecha}</div>
      </div>
      <div class="estadisticas">
        <div class="stat"><div class="stat-label">Total de Votos</div><div class="stat-value">${this.totalVotos}</div></div>
        <div class="stat"><div class="stat-label">Candidatos</div><div class="stat-value">${this.resultados.length}</div></div>
        ${this.resultados.length > 0 ? `<div class="stat"><div class="stat-label">Ganador</div><div class="stat-value" style="font-size: 20px;">🏆 ${this.resultados[0].nombre_candidato}</div></div>` : ''}
      </div>
      <table><thead><tr><th>Posición</th><th>Candidato</th><th>Votos</th><th>Porcentaje</th></tr></thead>
      <tbody>${this.resultados.map((r, i) => `
        <tr ${i === 0 ? 'class="ganador"' : ''}><td>${i + 1}</td><td>${r.nombre_candidato}</td><td>${r.cantidad_votos}</td><td>${r.porcentaje.toFixed(2)}%</td></tr>
      `).join('')}</tbody></table>
      <div class="footer"><p>Sistema de Votación Electrónica</p><p>Documento generado automáticamente - ${fecha}</p></div>
      </body></html>`;
  }

  volver() {
    if (this.esAdmin) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/votante/dashboard']);
    }
  }
}
