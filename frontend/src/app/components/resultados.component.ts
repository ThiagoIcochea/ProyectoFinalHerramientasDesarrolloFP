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
        <button class="btn-back" (click)="volver()">← Volver</button>
        <div *ngIf="proceso">
          <h1>Resultados: {{proceso.titulo}}</h1>
          <p class="estado-proceso">Estado: <span [class]="'badge-' + proceso.estado.toLowerCase()">{{proceso.estado}}</span></p>
        </div>
      </div>

      <div class="loading" *ngIf="cargando">Cargando resultados...</div>

      <div class="resultados-content" *ngIf="!cargando">
        <div class="estadisticas">
          <div class="stat-card">
            <div class="stat-icon">🗳️</div>
            <div class="stat-info">
              <div class="stat-label">Total de Votos</div>
              <div class="stat-value">{{totalVotos}}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <div class="stat-label">Candidatos</div>
              <div class="stat-value">{{resultados.length}}</div>
            </div>
          </div>
          <div class="stat-card ganador" *ngIf="resultados.length > 0">
            <div class="stat-icon">🏆</div>
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
                    <span *ngIf="i === 0" class="medalla">🏆</span>
                    <span *ngIf="i === 1" class="medalla">🥈</span>
                    <span *ngIf="i === 2" class="medalla">🥉</span>
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
          <button class="btn-export" (click)="exportarCSV()">📊 Exportar CSV</button>
          <button class="btn-export" (click)="exportarPDF()">📄 Exportar PDF</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { min-height: 100vh; background: #f5f5f5; padding: 32px 20px; }
    .header { max-width: 1200px; margin: 0 auto 32px; }
    .btn-back { padding: 8px 16px; background: #6c757d; color: white; border: none;
                 border-radius: 6px; cursor: pointer; margin-bottom: 16px; transition: background 0.3s; }
    .btn-back:hover { background: #5a6268; }
    h1 { margin: 0; color: #333; }
    .estado-proceso { margin: 8px 0 0; color: #666; }
    .badge-abierto { padding: 4px 12px; background: #d1fae5; color: #065f46; border-radius: 4px; font-weight: 700; }
    .badge-cerrado { padding: 4px 12px; background: #fee2e2; color: #991b1b; border-radius: 4px; font-weight: 700; }
    .badge-finalizado { padding: 4px 12px; background: #e0e7ff; color: #3730a3; border-radius: 4px; font-weight: 700; }
    .loading { text-align: center; padding: 40px; color: #666; }
    .resultados-content { max-width: 1200px; margin: 0 auto; }
    .estadisticas { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .stat-card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  display: flex; align-items: center; gap: 16px; }
    .stat-card.ganador { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }
    .stat-icon { font-size: 40px; }
    .stat-info { flex: 1; }
    .stat-label { color: #666; font-size: 14px; margin-bottom: 4px; }
    .stat-value { color: #333; font-size: 28px; font-weight: 700; }
    .resultados-tabla { background: white; padding: 32px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                         margin-bottom: 32px; }
    .resultados-tabla h2 { margin: 0 0 24px; color: #333; }
    .resultado-item { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
    .resultado-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .resultado-item.primer-lugar { background: linear-gradient(to right, #fef3c7 0%, transparent 100%);
                                     padding: 16px; border-radius: 8px; margin: -8px; margin-bottom: 16px; }
    .resultado-header { margin-bottom: 12px; }
    .candidato-info { display: flex; align-items: center; gap: 16px; }
    .avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
    .candidato-info h3 { margin: 0 0 8px; color: #333; font-size: 20px; }
    .medalla { font-size: 24px; margin-right: 8px; }
    .resultado-stats { display: flex; gap: 16px; }
    .votos { color: #666; font-weight: 600; }
    .porcentaje { color: #2563eb; font-weight: 700; font-size: 18px; }
    .barra-container { height: 30px; background: #e5e7eb; border-radius: 15px; overflow: hidden; }
    .barra-progreso { height: 100%; background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
                       transition: width 1s ease-out; }
    .barra-progreso.barra-ganador { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
    .grafico-visual { background: white; padding: 32px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                       margin-bottom: 32px; }
    .grafico-visual h2 { margin: 0 0 32px; color: #333; }
    .grafico-barras { display: flex; align-items: flex-end; justify-content: space-around; height: 400px;
                       padding: 20px; background: #f8fafc; border-radius: 8px; }
    .barra-item { flex: 1; display: flex; flex-direction: column; align-items: center; max-width: 150px; }
    .barra-visual { width: 100%; flex: 1; display: flex; align-items: flex-end; justify-content: center; }
    .barra-fill { width: 60%; min-height: 5%; background: #2563eb; border-radius: 8px 8px 0 0;
                   position: relative; transition: height 1s ease-out; display: flex; align-items: flex-start;
                   justify-content: center; padding-top: 8px; }
    .barra-fill.barra-gold { background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%); }
    .barra-fill.barra-silver { background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%); }
    .barra-fill.barra-bronze { background: linear-gradient(180deg, #fb923c 0%, #f97316 100%); }
    .barra-valor { color: white; font-weight: 700; font-size: 16px; }
    .barra-label { margin-top: 12px; text-align: center; width: 100%; }
    .avatar-mini { width: 40px; height: 40px; border-radius: 50%; margin-bottom: 8px; }
    .barra-label span { display: block; font-size: 12px; color: #666; font-weight: 600; }
    .empty { text-align: center; padding: 40px; color: #999; }
    .acciones { display: flex; gap: 16px; justify-content: center; }
    .btn-export { padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 8px;
                   font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn-export:hover { background: #059669; transform: translateY(-2px); }
    @media (max-width: 768px) {
      .estadisticas { grid-template-columns: 1fr; }
      .grafico-barras { height: 300px; }
      .barra-item { max-width: 80px; }
      .barra-label span { font-size: 10px; }
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
