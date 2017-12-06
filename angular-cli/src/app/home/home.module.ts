import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdTableComponent } from '../md/md-table/md-table.component';

import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(HomeRoutes),
        FormsModule
    ],
    declarations: [HomeComponent, MdTableComponent]
})

export class HomeModule {}
