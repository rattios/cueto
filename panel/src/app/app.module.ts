import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule,MatCardModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatSlideToggleModule, DateAdapter } from '@angular/material';
import {NG2DataTableModule} from "angular2-datatable-pagination";
import { ReactiveFormsModule} from "@angular/forms";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsModalModule } from 'ng2-bs3-modal';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { Ng2UploaderModule } from 'ng2-uploader';

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
    NG2DataTableModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    Ng2SearchPipeModule,
    BsModalModule,
    Ng2UploaderModule,
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
