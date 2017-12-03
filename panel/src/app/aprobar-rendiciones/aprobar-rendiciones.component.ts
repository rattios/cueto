import { Component, OnInit, HostListener} from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { RutaService } from '../services/ruta.service';

declare const $: any;

@Component({
  selector: 'app-aprobar-rendiciones',
  templateUrl: './aprobar-rendiciones.component.html',
  styleUrls: ['./aprobar-rendiciones.component.css']
})
export class AprobarRendicionesComponent implements OnInit {
	ESCAPE_KEYCODE = 27;
    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.keyCode === this.ESCAPE_KEYCODE) {
          if (this.loading==true) {
            console.log(event.keyCode);
            window.location.reload();
          }   
        }
    }
    public loading:any;
    public data:any;

	constructor(private http: HttpClient, private builder: FormBuilder, private ruta: RutaService) { }

	ngOnInit() {
		//this.loading=true;

       // this.http.get(this.ruta.get_ruta()+'public/rendiciones?estado=P')
       //     .toPromise()
       //     .then(
       //     data => {

       //         this.data=data;
       //         console.log(this.data);
       //      },
       //     msg => { // Error
       //       console.log(msg);
       //       alert('error:'+msg.error);
       //     });
    }
}
