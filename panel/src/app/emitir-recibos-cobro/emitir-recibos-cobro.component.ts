import { Component, OnInit, HostListener} from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { RutaService } from '../services/ruta.service';

declare const $: any;

@Component({
  selector: 'app-emitir-recibos-cobro',
  templateUrl: './emitir-recibos-cobro.component.html',
  styleUrls: ['./emitir-recibos-cobro.component.css']
})
export class EmitirRecibosCobroComponent implements OnInit {

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
    public vendedores:any;
    public vendedores2:any;

	constructor(private http: HttpClient, private builder: FormBuilder, private ruta: RutaService) { }

	ngOnInit() {
		this.loading=true;

        this.http.get(this.ruta.get_ruta()+'public/sucursales/'+localStorage.getItem("manappger_user_sucursal_id")+'/carteras')
           .subscribe((data)=> {
           		
               	this.data=data;
               	this.data=this.data.sucursal[0];
               	this.loading=false;
               	console.log(this.data);

               	this.vendedores=[];
               	this.vendedores.push({
               		id:0,
               		vendedor:this.data.carteras[0].descripcion,
               		link:true,
               		cartera:[]
               	});

               	for (var i = 0; i < this.data.carteras.length; ++i) {
               		for (var j = 0; j < this.vendedores.length; j++) {
               			if (this.vendedores[j].vendedor!=this.data.carteras[i].descripcion) {
               				this.vendedores.push({
               					id:i,
			               		vendedor:this.data.carteras[i].descripcion,
			               		link:false,
			               		cartera:[]
			               	});
               			}
               		}
               	}

				var hash = {};
				this.vendedores = this.vendedores.filter(function(current) {
				  var exists = !hash[current.vendedor] || false;
				  hash[current.vendedor] = true;
				  return exists;
				});

               	for (var i = 1; i < this.data.carteras.length; i++) {
               		for (var j = 0; j < this.vendedores.length; j++) {
               			if (this.vendedores[j].vendedor==this.data.carteras[i].descripcion) {
               				this.vendedores[j].cartera.push(this.data.carteras[i]);
               			}
               		}
               	}
               	console.log(this.vendedores);
               	for (var j = 1; j < this.vendedores.length; j++) {
               		this.vendedores2=[];
	               	this.vendedores2.push({
	               		id:this.vendedores[j].id,
	               		vendedor:this.vendedores[j].vendedor,
	               		link:this.vendedores[j].link,
	               		cartera:this.vendedores[j].cartera
	               	});
	            }
               	console.log(this.vendedores2);
            });
	}
	selectTab(id){
		console.log(id);
		for (var j = 0; j < this.vendedores.length; j++) {
			this.vendedores[j].link=false;
   			if (this.vendedores[j].id==id) {
   				this.vendedores[j].link=true;
   			}
   		}
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

}
