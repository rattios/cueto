import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { LoginComponent } from './login/login.component';
import { SociosComponent } from './socios/socios.component';
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ReportesComponent } from './reportes/reportes.component';
import { AprobarRendicionesComponent } from './aprobar-rendiciones/aprobar-rendiciones.component';
import { IngresarRendicionesComponent } from './ingresar-rendiciones/ingresar-rendiciones.component';
import { EmitirRecibosCobroComponent } from './emitir-recibos-cobro/emitir-recibos-cobro.component';
import { TarifasComponent } from './tarifas/tarifas.component';

const routes: Routes =[
    { path: '',                     redirectTo: '/login', pathMatch: 'full' },
    { path: 'Panel-principal',      component: DashboardComponent, pathMatch: 'full'},
    { path: 'Afiliados',            component: SociosComponent, pathMatch: 'full' },
    { path: 'Clientes',             component: UserProfileComponent },
    { path: 'Socios',               component: SociosComponent },
    { path: 'Usuarios-Afiliados',   component: AfiliadosComponent },
    { path: 'login',                component: LoginComponent },
    { path: 'Reportes',             component: ReportesComponent },
    { path: 'AprobarRendiciones',   component: AprobarRendicionesComponent },
    { path: 'IngresarRendiciones',  component: IngresarRendicionesComponent },
    { path: 'EmitirRecibosCobro',   component: EmitirRecibosCobroComponent },
    { path: 'Tarifas',              component: TarifasComponent },
    { path: '**',                   redirectTo: '/login' }
      
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
