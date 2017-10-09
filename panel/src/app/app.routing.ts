import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { LoginComponent } from './login/login.component';
import { SociosComponent } from './socios/socios.component';
import { HistorialComponent } from './historial/historial.component';
import { ServiciosComponent } from './servicios/servicios.component';

const routes: Routes =[
    { path: '',          redirectTo: '/login', pathMatch: 'full' },
    { path: 'Panel-principal',      component: DashboardComponent, pathMatch: 'full'},
    { path: 'Usuarios',   component: UserProfileComponent, pathMatch: 'full' },
    { path: 'Socios',     component: SociosComponent },
    { path: 'Servicios',     component: ServiciosComponent },
    { path: 'Historial-servicios',     component: HistorialComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'login',        component: LoginComponent },
    { path: '**', redirectTo: '/login' }
      
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
