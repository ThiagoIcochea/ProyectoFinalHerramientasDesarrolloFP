import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DashboardAdminComponent } from './components/dashboard-admin.component';
import { CrearProcesoComponent } from './components/crear-proceso.component';
import { EditarProcesoComponent } from './components/editar-proceso.component';
import { GestionarCandidatosComponent } from './components/gestionar-candidatos.component';
import { DashboardVotanteComponent } from './components/dashboard-votante.component';
import { VotarComponent } from './components/votar.component';
import { ResultadosComponent } from './components/resultados.component';
import { Error404Component } from './components/error-404.component';
import { ErrorGeneralComponent } from './components/error-general.component';
import { LogsAuditoriaComponent } from './components/logs-auditoria.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'admin/crear-proceso', component: CrearProcesoComponent },
  { path: 'admin/editar-proceso/:id', component: EditarProcesoComponent },
  { path: 'admin/candidatos/:id', component: GestionarCandidatosComponent },
  { path: 'admin/resultados/:id', component: ResultadosComponent },
  { path: 'admin/logs', component: LogsAuditoriaComponent },

  { path: 'votante/dashboard', component: DashboardVotanteComponent },
  { path: 'votante/votar/:id', component: VotarComponent },
  { path: 'votante/resultados/:id', component: ResultadosComponent },

  { path: 'error', component: ErrorGeneralComponent },
  { path: '404', component: Error404Component },
  { path: '**', component: Error404Component }
];
