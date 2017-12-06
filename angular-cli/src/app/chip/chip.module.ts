import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { ChipComponent } from './chip.component';
import { ChipRoutes } from './chip.routing';

@NgModule({
    imports: [
        RouterModule.forChild(ChipRoutes),
        CommonModule,
        FormsModule
    ],
    declarations: [ChipComponent]
})

export class ChipModule {}
