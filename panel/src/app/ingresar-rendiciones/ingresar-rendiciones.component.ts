import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { RutaService } from '../services/ruta.service';

declare const $: any;


@Component({
  selector: 'app-ingresar-rendiciones',
  templateUrl: './ingresar-rendiciones.component.html',
  styleUrls: ['./ingresar-rendiciones.component.css']
})
export class IngresarRendicionesComponent implements OnInit {
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
    public recibos:any;
    public carteras:any;
    public fechaSistema:any;
    public registroClienteForm: FormGroup;


	constructor(private http: HttpClient, private builder: FormBuilder, private ruta: RutaService) { 
		this.registroClienteForm = builder.group({
            estado: ["P"],
            sucursal_id: [localStorage.getItem("manappger_user_sucursal_id")],
            sucursal: [localStorage.getItem("manappger_user_sucursal_id")],
            cartera_id: [""],
            cobrador_id: [localStorage.getItem("manappger_user_id")],
            cobrador: [localStorage.getItem("manappger_user_nombre")],
            fecha: [],
            monto: [""],
            todos: [true],
            recibos: this.builder.array([this.recibosArray()])
        })
	}

	recibosArray(){
        return this.builder.group({
            id: [],
            importe: [],
            abono: [],
            detalle: [],
            check: [true],
            item: [],
            cliente_id: []
            })
    }

	ngOnInit() {

		this.loading=true;
		setTimeout(()=>{
   			this.http.get(this.ruta.get_ruta()+'public/recibos?estado=E')
	         .toPromise()
	         .then(
	           data => { // Success
	             console.log(data);
	             this.recibos=data;
	             this.recibos=this.recibos.recibos;
	             for (var i = 0; i < this.recibos.length; i++) {
	             	this.recibos[i].mes=this.meses(this.recibos[i].mes);
	             }
	             this.loading=false;

		      	 console.log(this.registroClienteForm);
	           },
	           msg => { // Error
	            
	             console.log(msg);

	             this.loading=false;
	             this.showNotification('top','center',JSON.stringify(msg.error.error),1);
	           }
	        );
  		}, 1000);
		

        this.http.get(this.ruta.get_ruta()+'public/sucursales/'+localStorage.getItem("manappger_user_sucursal_id")+'/carteras')
           .subscribe((data)=> {

               this.data=data;
               this.data=this.data.sucursal[0];
               this.carteras=this.data.carteras;
               this.sucursal=this.data.nombre;
               this.registroClienteForm.patchValue({sucursal: this.sucursal });
               console.log(this.data);
               console.log(this.sucursal);
              
                this.loading=false;
            });
       	this.http.get(this.ruta.get_ruta()+'public/getHour')
           .subscribe((data)=> {
             console.log(data);
               this.fechaSistema=data;
               this.fechaSistema=this.fechaSistema.fechaSistema;
               this.registroClienteForm.patchValue({fecha: this.fechaSistema });
               //alert(this.fechaSistema);
            });
	}

	uppercase(value: string) {
      return value.toUpperCase();
    }

	meses(mes){
	  	if(mes==1) {
	  		return 'ENERO';
	  	}else if(mes==2) {
	  		return 'FEBRERO';
	  	}else if(mes==3) {
	  		return 'MARZO';
	  	}else if(mes==4) {
	  		return 'ABRIL';
	  	}else if(mes==5) {
	  		return 'MAYO';
	  	}else if(mes==6) {
	  		return 'JUNIO';
	  	}else if(mes==7) {
	  		return 'JULIO';
	  	}else if(mes==8) {
	  		return 'AGOSTO';
	  	}else if(mes==9) {
	  		return 'SEPTIEMBRE';
	  	}else if(mes==10) {
	  		return 'OCTUBRE';
	  	}else if(mes==11) {
	  		return 'NOVIEMBRE';
	  	}else if(mes==12) {
	  		return 'DICIEMBRE';
	  	}
	}

	meses2(mes){
	  	if(mes=='ENERO') {
	  		return 1;
	  	}else if(mes=='FEBRERO') {
	  		return 2;
	  	}else if(mes=='MARZO') {
	  		return 3;
	  	}else if(mes=='ABRIL') {
	  		return 4;
	  	}else if(mes=='MAYO') {
	  		return 5;
	  	}else if(mes=='JUNIO') {
	  		return 6;
	  	}else if(mes=='JULIO') {
	  		return 7;
	  	}else if(mes=='AGOSTO') {
	  		return 8;
	  	}else if(mes=='SEPTIEMBRE') {
	  		return 9;
	  	}else if(mes=='OCTUBRE') {
	  		return 10;
	  	}else if(mes=='NOVIEMBRE') {
	  		return 11;
	  	}else if(mes=='DICIEMBRE') {
	  		return 12;
	  	}
	}
	  public id:any;
	  public nAfiliado:any;
	  public nRecibo:any;
	  public cuotaMes:any;
	  public detalle:any;
	  public sucursal:any;
	  public importe:any;
	  public tipoAfiliado:any;
	  public verRecibo:any;
	  public fRendicion:any;
	  
	  verDetalleRecibo(item){
	  	item=item.value.item;
	  	console.log(item);
	  	this.nAfiliado=item.cliente.id;
	  	this.nRecibo=item.num_recibo;
	  	this.cuotaMes=item.mes+'-'+item.anio;
	  	this.detalle=item.detalle;
	  	this.importe=item.importe;
	  	this.tipoAfiliado=item.cliente.tipo;
		this.fRendicion=new Date();
	  	if(this.tipoAfiliado=="AF_CUETO") {
	  		this.tipoAfiliado='GFS';
	  	}else if(this.tipoAfiliado=="AF_CUETO_S") {
	  		this.tipoAfiliado='SSF';
	  	}

	  	

	  	if(this.detalle.length>1) {
	  		this.detalle[0].nombre=item.cliente.nombre_1+' '+this.checkNULL(item.cliente.nombre_2)+' '+item.cliente.apellido_1+' '+this.checkNULL(item.cliente.apellido_2);
	  		this.detalle[0].dni=item.cliente.dni;
	  		this.detalle[0].vinculo='TITULAR';
	  		for (var i = 1; i < this.detalle.length; i++) {
	  			for (var j = 0; j < item.cliente.familiares.length; j++) {
	  				if(this.detalle[i].id_persona==item.cliente.familiares[j].id) {
	  					this.detalle[i].nombre=item.cliente.familiares[j].nombre_1+' '+this.checkNULL(item.cliente.familiares[j].nombre_2)+' '+item.cliente.familiares[j].apellido_1+' '+this.checkNULL(item.cliente.familiares[j].apellido_2);
	  					this.detalle[i].dni=item.cliente.familiares[j].dni;
	  					this.detalle[i].vinculo=item.cliente.familiares[j].vinculo;
	  				}
	  			}
	  		}
	  	}else if(this.detalle.length==1){
	  		for (var i = 0; i < this.detalle.length; i++) {
	  			if(this.detalle[i].id_persona==item.cliente.id) {
	  					this.detalle[i].nombre=item.cliente.nombre_1+' '+this.checkNULL(item.cliente.nombre_2)+' '+item.cliente.apellido_1+' '+this.checkNULL(item.cliente.apellido_2);
	  					this.detalle[i].dni=item.cliente.dni;
	  					this.detalle[i].vinculo='TITULAR';
	  				}
	  		}
	  	}
	  	


	    this.verRecibo=true;
	    //this.sucursal=localStorage.getItem("manappger_user_sucursal_id");
	  }
	  checkNULL(item){
	  	console.log(item);
	  	if(item==null || item=='NULL' || item=='') {
	  		console.log('entro null');
	  		return '';
	  	}else{
	  		console.log('else');
	  		return item;
	  	}
	  }
	  private formSumitAttempt: boolean;
	   isFieldValid(field: string) {
	    return (
	      (!this.registroClienteForm.get(field).valid && this.registroClienteForm.get(field).touched) ||
	      (this.registroClienteForm.get(field).untouched && this.formSumitAttempt)
	    );
	  }
	  displayFieldCss(field: string) {
	    return {
	      'has-error': this.isFieldValid(field),
	      'has-feedback': this.isFieldValid(field)
	    };
	  }

	  volver(){
	  	this.verRecibo=false;
	  }

	  aprobar(){
	  	var send={
	  		estado:'R'
	  	};
	  	this.http.put(this.ruta.get_ruta()+'public/recibos/'+this.nRecibo,send)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.loading=false;
             this.showNotification('top','center','Registrada la rendición con éxito.',1);
           },
           msg => { // Error
             console.log(msg);
             this.loading=false;
             this.showNotification('top','center',JSON.stringify(msg.error.error),1);
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

    public getTicket(id) {
      console.log(id.target.value);
      const control= <FormArray>this.registroClienteForm.controls["recibos"];
      this.clearArray();

      
      setTimeout(()=>{
	      for (var i = 1; i < this.recibos.length; i++) {
	      	if(id.target.value==this.recibos[i].cartera_id) {
	          (<FormArray>this.registroClienteForm.controls['recibos']).push(this.recibosArray());
	        }
	      }
	      var monto=0;
	      for (var i = 0; i < this.recibos.length; i++) {
	      	if(id.target.value==this.recibos[i].cartera_id) {
		      	(<FormArray>this.registroClienteForm.controls['recibos']).at(i).patchValue({id: this.recibos[i].id });
		        (<FormArray>this.registroClienteForm.controls['recibos']).at(i).patchValue({importe: this.recibos[i].importe });
		        (<FormArray>this.registroClienteForm.controls['recibos']).at(i).patchValue({abono: this.recibos[i].importe });
		        (<FormArray>this.registroClienteForm.controls['recibos']).at(i).patchValue({detalle: this.recibos[i].detalle });
		      /*  (<FormArray>this.registroClienteForm.controls['recibos']).at(i).patchValue({check: false });*/
		        (<FormArray>this.registroClienteForm.controls['recibos']).at(i).patchValue({cliente_id: this.recibos[i].cliente.id });
		        (<FormArray>this.registroClienteForm.controls['recibos']).at(i).patchValue({item: this.recibos[i] });
		        monto=monto+this.recibos[i].importe;
		    }
		  }
		  this.registroClienteForm.patchValue({monto: monto });
	  }, 1000);
    }
    public clearArray(){
        this.registroClienteForm.controls['recibos'] = this.builder.array([this.recibosArray()]);
    }


    todos(state){
    	console.log(state.target.value);
    }
    checks(state,index,client){

    	console.log((<FormArray>this.registroClienteForm.controls['recibos']).at(index).value);
    	
    	if(state.checked) {
    		this.registroClienteForm.patchValue({monto: this.registroClienteForm.value.monto+ parseFloat((<FormArray>this.registroClienteForm.controls['recibos']).at(index).value.abono)});
    	}else{
    		this.registroClienteForm.patchValue({monto: this.registroClienteForm.value.monto- parseFloat((<FormArray>this.registroClienteForm.controls['recibos']).at(index).value.abono)});
    	}

    	
    }
    changeMonto(e,index){
    	var monto=0;
    	for (var i = 0; i < (<FormArray>this.registroClienteForm.controls['recibos']).length; i++) {
    		if((<FormArray>this.registroClienteForm.controls['recibos']).at(i).value.check) {
    			if((<FormArray>this.registroClienteForm.controls['recibos']).at(i).value.abono=='') {
    				monto=monto+0;
    				(<FormArray>this.registroClienteForm.controls['recibos']).at(i).patchValue({abono: 0 });
    			}else{
    				monto=monto+parseFloat((<FormArray>this.registroClienteForm.controls['recibos']).at(i).value.abono);
    			}
    		}
    		
    	}
    	this.registroClienteForm.patchValue({monto: monto });
    }
    enviar(form){
    	
    	console.log((<FormArray>this.registroClienteForm.controls['recibos'].value));
    	var reci=<FormArray>this.registroClienteForm.controls['recibos'].value;
    	for (var i = 0; i < reci.length; ++i) {
    		reci[i].item.mes=this.meses2(reci[i].item.mes);
    	}
    	var reci3=[];
    	for (var i = 0; i < reci.length; i++) {
    		if(reci[i].check) {
    			reci3.push(reci[i]);
    		}
    	}
    	var reci2=JSON.stringify(reci3);
    	var send={
    		estado: this.registroClienteForm.value.estado,
            sucursal_id: this.registroClienteForm.value.sucursal_id,
            cartera_id: this.registroClienteForm.value.cartera_id,
            cobrador_id: this.registroClienteForm.value.cobrador_id,
            fecha: this.registroClienteForm.value.fecha,
            monto: this.registroClienteForm.value.monto,
            recibos: reci2
        }
    	setTimeout(()=>{
    	console.log(send);
    	this.http.post(this.ruta.get_ruta()+'public/rendiciones/'+send.cartera_id,send)
         .toPromise()
         .then(
           data => { // Success
             this.loading=false;
             console.log(data);
             
             //this.showNotification('top','center','Actualizado con exito',2);
           },
           msg => { // Error
             console.log(msg);

             this.loading=false;
             //this.showNotification('top','center',JSON.stringify(msg.error.error),1);
           }
         );
    	}, 200);
    }	



}
