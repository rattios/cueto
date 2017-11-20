import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    // { path: '/Panel-principal', title: 'Panel Principal',  icon: 'dashboard', class: '' },
    // { path: '/Afiliados', title: 'Ingresar Afiliados',  icon:'person', class: '' },
     { path: '/Clientes', title: 'Ingresar Afiliados',  icon:'supervisor_account', class: '' },
     { path: '/Usuarios-Afiliados', title: 'Afiliados',  icon:'folder_shared', class: '' },
     { path: '/Tarifas', title: 'Tarifas',  icon:'library_books', class: '' },
     //{ path: '/Usuarios-Afiliados', title: 'Afiliados',  icon:'folder_shared', class: '' },
     //{ path: '/Usuarios-Afiliados', title: 'Afiliados',  icon:'folder_shared', class: '' },
     //{ path: '/Usuarios-Afiliados', title: 'Afiliados',  icon:'folder_shared', class: '' },        
     // { path: '../table-list', title: 'Typography',  icon:'library_books', class: '' },
     // { path: '../typography', title: 'Typography',  icon:'library_books', class: '' },
     // { path: '../icons', title: 'Icons',  icon:'bubble_chart', class: '' },
     // { path: '../maps', title: 'Maps',  icon:'location_on', class: '' },
     // { path: '../notifications', title: 'Notifications',  icon:'notifications', class: '' },
     // { path: '../upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
//
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
  clientes() {
    this.router.navigate(['/Clientes']);
  };
  usuariosAfiliados() {
    this.router.navigate(['/Usuarios-Afiliados']);
  };
  aprobarRendiciones() {
    this.router.navigate(['/AprobarRendiciones']);
  };
  ingresarRendiciones() {
    this.router.navigate(['/IngresarRendiciones']);
  };
  emitirRecibosCobro() {
    this.router.navigate(['/EmitirRecibosCobro']);
  };
  tarifas() {
    this.router.navigate(['/Tarifas']);
  };
  reportes() {
    this.router.navigate(['/Reportes']);
  };
}
