import { Routes } from '@angular/router';

import { AgregarPacienteComponent } from './agregarPaciente.component';

export const AgregarPacienteRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: AgregarPacienteComponent
    }]
}
];
