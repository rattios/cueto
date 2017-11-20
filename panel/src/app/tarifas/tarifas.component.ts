import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { RutaService } from '../services/ruta.service';

declare const $: any;

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent implements OnInit {

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
	public familiares:any;
	public familiaresSolo:any;
	public convenio:any;
	public convenioSolo:any;

	public edad_min:any;
	public edad_max:any;
	public tarifa:any;
	public carencia:any;
	public objectoTarifa:any;

	public loadingT=true;
	public loadingTS=true;
	public loadingC=true;
	public loadingCS=true;

	public postRuta:any;

	public crear:any;

	constructor(private http: HttpClient, private builder: FormBuilder, private ruta: RutaService) { }

	ngOnInit() {
		this.loading=true;

		this.http.get(this.ruta.get_ruta()+'public/tarifas')
           .toPromise()
           .then(
           data => {
               this.familiares=data;
               this.familiares=this.familiares.familiares;

               this.familiaresSolo=data;
               this.familiaresSolo=this.familiaresSolo.familiaresSolo;

               this.convenio=data;
               this.convenio=this.convenio.convenio;

               this.convenioSolo=data;
               this.convenioSolo=this.convenioSolo.convenioSolo;

               this.loading=false;
               //this.checkLoading();
               console.log(data);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });

        /*this.http.get(this.ruta.get_ruta()+'public/tarifas_familiar')
           .toPromise()
           .then(
           data => {
               this.familiares=data;
               this.loadingT=false;
               this.checkLoading();
               console.log(this.familiares);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });
        this.http.get(this.ruta.get_ruta()+'public/tarifas_solo')
           .toPromise()
           .then(
           data => {
               this.familiaresSolo=data;
               this.loadingTS=false;
               this.checkLoading();
               console.log(this.familiaresSolo);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });
        this.http.get(this.ruta.get_ruta()+'public/tarifas_convenio')
           .toPromise()
           .then(
           data => {
               this.convenio=data;
               this.loadingC=false;
               this.checkLoading();
               console.log(this.convenio);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });
        this.http.get(this.ruta.get_ruta()+'public/tarifas_convenio_sola')
           .toPromise()
           .then(
           data => {
               this.convenioSolo=data;
               this.loadingCS=false;
               this.checkLoading();
               console.log(this.convenioSolo);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });*/
	}

	getTarifa(item,ruta){
		this.edad_min=item.edad_min;
		this.edad_max=item.edad_max;
		this.tarifa=item.tarifa;
		this.carencia=item.carencia;
		this.objectoTarifa=item;
		this.postRuta=ruta;
	}

	checkLoading(){
		if (this.loadingT==false && this.loadingTS==false && this.loadingC==false && this.loadingCS==false) {
			this.loading=false;
		}
	}

	checkCrear(val,ruta){
		this.crear=val;
		this.postRuta=ruta;
		if (val==true) {
			this.edad_min='';
			this.edad_max='';
			this.tarifa='';
			this.carencia='';
		}
	}

	crearTarifa(){
		
		var send={
			edad_min: this.edad_min,
			edad_max: this.edad_max,
			tarifa: this.tarifa,
			carencia: this.carencia
		}
		console.log(this.postRuta);
		console.log(send);

        this.loading=true;
        this.http.post(this.ruta.get_ruta()+'public/'+this.postRuta+'/store',send)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.showNotification('top','center','Creado con exito',2);
             this.resetear();

           },
           msg => { // Error
             console.log(msg);
             this.showNotification('top','center','Ha ocurrido un error' + JSON.stringify(msg.error),4);
             this.loading=false;
           }
         );
	}

	editar(){
		console.log(this.objectoTarifa);
		var send={
			edad_min: this.edad_min,
			edad_max: this.edad_max,
			tarifa: this.tarifa,
			carencia: this.carencia
		}
        this.loading=true;
        this.http.put(this.ruta.get_ruta()+'public/'+this.postRuta+'/'+this.objectoTarifa.id,send)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.showNotification('top','center','Actualizado con exito',2);
             this.resetear();

           },
           msg => { // Error
             console.log(msg);
             this.showNotification('top','center','Ha ocurrido un error' + JSON.stringify(msg.error),4);
             this.loading=false;
           }
         );
	}

	eliminar(){
		console.log(this.objectoTarifa);

        this.loading=true;
        this.http.delete(this.ruta.get_ruta()+'public/'+this.postRuta+'/'+this.objectoTarifa.id)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.showNotification('top','center','Eliminado con exito',2);
             this.resetear();

           },
           msg => { // Error
             console.log(msg);
             this.showNotification('top','center','Ha ocurrido un error' + JSON.stringify(msg.error),4);
             this.loading=false;
           }
         );
	}

	showNotification(from, align, mensaje,colors){
          const type = ['','info','success','warning','danger'];

          const color = colors;
          
          $.notify({
              icon: "notifications",
              message: mensaje

          },{
              type: type[color],
              timer: 4000,
              placement: {
                  from: from,
                  align: align
              }
          });
    }

    resetear(){
    	this.http.get(this.ruta.get_ruta()+'public/tarifas')
           .toPromise()
           .then(
           data => {
               this.familiares=data;
               this.familiares=this.familiares.familiares;

               this.familiaresSolo=data;
               this.familiaresSolo=this.familiaresSolo.familiaresSolo;

               this.convenio=data;
               this.convenio=this.convenio.convenio;

               this.convenioSolo=data;
               this.convenioSolo=this.convenioSolo.convenioSolo;

               this.loading=false;
               //this.checkLoading();
               console.log(data);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });
    	/*this.http.get(this.ruta.get_ruta()+'public/tarifas_familiar')
           .toPromise()
           .then(
           data => {
               this.familiares=data;
               this.loadingT=false;
               this.checkLoading();
               console.log(this.familiares);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });
        this.http.get(this.ruta.get_ruta()+'public/tarifas_solo')
           .toPromise()
           .then(
           data => {
               this.familiaresSolo=data;
               this.loadingTS=false;
               this.checkLoading();
               console.log(this.familiaresSolo);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });
        this.http.get(this.ruta.get_ruta()+'public/tarifas_convenio')
           .toPromise()
           .then(
           data => {
               this.convenio=data;
               this.loadingC=false;
               this.checkLoading();
               console.log(this.convenio);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });
        this.http.get(this.ruta.get_ruta()+'public/tarifas_convenio_sola')
           .toPromise()
           .then(
           data => {
               this.convenioSolo=data;
               this.loadingCS=false;
               this.checkLoading();
               console.log(this.convenioSolo);
            },
           msg => { // Error
             console.log(msg.error.error);
             this.loading=false;
             alert('error:'+msg.error);
           });*/
    }

}
