import { Routes } from '@angular/router';

import { ChipComponent } from './chip.component';

export const ChipRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ChipComponent
    }]
}
];
