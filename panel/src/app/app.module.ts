import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule,MatCardModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatSlideToggleModule, DateAdapter } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { NG2DataTableModule} from "angular2-datatable-pagination";
import { ReactiveFormsModule} from "@angular/forms";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsModalModule } from 'ng2-bs3-modal';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { Ng2UploaderModule } from 'ng2-uploader';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgxPermissionsModule } from 'ngx-permissions';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

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
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { DataFilterPipe } from "./data-filter.pipe";
import { DateFormat } from './date-format';
import { TextTransformerDirective } from './text-transformer-directive.directive';
import { RutaService } from './services/ruta.service';
import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';
import { ReportesComponent } from './reportes/reportes.component';
import { AprobarRendicionesComponent } from './aprobar-rendiciones/aprobar-rendiciones.component';
import { IngresarRendicionesComponent } from './ingresar-rendiciones/ingresar-rendiciones.component';
import { EmitirRecibosCobroComponent } from './emitir-recibos-cobro/emitir-recibos-cobro.component';
import { TarifasComponent } from './tarifas/tarifas.component';
import { AprobarPagosComponent } from './aprobar-pagos/aprobar-pagos.component';
import { HistorialPagosComponent } from './historial-pagos/historial-pagos.component';
import { AprobadosComponent } from './aprobados/aprobados.component';
import { RecibosComponent } from './recibos/recibos.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    LoginComponent,
    SociosComponent,
    AfiliadosComponent,
    ServiciosComponent,
    DataFilterPipe,
    TextTransformerDirective,
    FieldErrorDisplayComponent,
    ReportesComponent,
    AprobarRendicionesComponent,
    IngresarRendicionesComponent,
    EmitirRecibosCobroComponent,
    TarifasComponent,
    AprobarPagosComponent,
    HistorialPagosComponent,
    AprobadosComponent,
    RecibosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTableModule,
    MatTabsModule,
    NG2DataTableModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    Ng2SearchPipeModule,
    BsModalModule,
    Ng2UploaderModule,
    ProgressbarModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    LoadingModule.forRoot({
        animationType: ANIMATION_TYPES.wanderingCubes,
        backdropBackgroundColour: 'rgba(0,0,0,0.5)', 
        backdropBorderRadius: '8px',
        primaryColour: '#ffffff', 
        secondaryColour: '#ffffff', 
        tertiaryColour: '#ffffff'
    })
  ],
  exports: [

  ],
  providers: [
    RutaService,
    { provide: DateAdapter, useClass: DateFormat },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
    constructor(private dateAdapter:DateAdapter<Date>) {
        dateAdapter.setLocale('en-in'); // DD/MM/YYYY
    }
}
