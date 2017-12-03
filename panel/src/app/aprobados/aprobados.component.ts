import { Component, OnInit, HostListener} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { RutaService } from '../services/ruta.service';

declare const $: any;

@Component({
  selector: 'app-aprobados',
  templateUrl: './aprobados.component.html',
  styleUrls: ['./aprobados.component.css']
})
export class AprobadosComponent implements OnInit {

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

	constructor(private http: HttpClient, private builder: FormBuilder, private ruta: RutaService) { }

	ngOnInit() {
		this.loading=true;
		this.http.get(this.ruta.get_ruta()+'public/rendiciones?estado=A')
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.recibos=data;
             this.recibos=this.recibos.rendiciones;
             //for (var i = 0; i < this.recibos.length; ++i) {
             //	this.recibos[i].mes=this.meses(this.recibos[i].mes);
             //}
             this.productList = this.recibos;
             this.filteredItems = this.productList;
             
             this.init();

             this.loading=false;
             //this.showNotification('top','center','Actualizado con exito',2);
           },
           msg => { // Error
            
             console.log(msg);

             this.loading=false;
             this.showNotification('top','center',JSON.stringify(msg.error.error),1);
           }
         );
	}
  public verRendicion=false;
  public cobradorUser:any;
  public carteraNumero:any;
  public monto:any;
  public recibosRendicion:any;
  public item:any;
  public infoRendicion:any;

  ir(item){
    console.log(item);
    this.infoRendicion=item;
    this.verRendicion=true;

    this.item=item;
    this.cobradorUser=item.cobrador.user;
    this.carteraNumero=item.cartera.numero;
    this.monto=item.monto;
    this.recibosRendicion=item.recibos;
  }

  volverPrincipal(){
    this.verRendicion=false;
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

	mesesReverso(mes){
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
	    this.sucursal=localStorage.getItem("manappger_user_sucursal_id");
	  }
	  checkNULL(item){
	  	if(item==null || item=='NULL' || item=='') {
	  		return '';
	  	}else{
	  		return item;
	  	}
	  }


	  volver(){
	  	this.verRecibo=false;
	  }

	  aprobar(){
      this.infoRendicion.autorizante_id=localStorage.getItem("manappger_user_id");
      
	  	console.log(this.infoRendicion);
	  	
	  	this.http.put(this.ruta.get_ruta()+'public/rendiciones/'+this.infoRendicion.id,this.infoRendicion)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.loading=false;
             this.showNotification('top','center','Aprobada la rendición con éxito.',1);
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

    // -------------------------------------------------------------------------------------------------------------------
   productList : any;
   filteredItems : any;
   pages : number = 4;
   pageSize : number = 5;
   pageNumber : number = 0;
   currentIndex : number = 1;
   items: any;
   pagesIndex : Array<number>;
   pageStart : number = 1;
   inputName : string = '';

   init(){
         this.currentIndex = 1;
         this.pageStart = 1;
         this.pages = 4;

         this.pageNumber = parseInt(""+ (this.filteredItems.length / this.pageSize));
         if(this.filteredItems.length % this.pageSize != 0){
            this.pageNumber ++;
         }
    
         if(this.pageNumber  < this.pages){
               this.pages =  this.pageNumber;
         }
       
         this.refreshItems();
         console.log("this.pageNumber :  "+this.pageNumber);
   }

   FilterByName(){
      this.filteredItems = [];
      if(this.inputName != ""){
            for (var i = 0; i < this.productList.length; ++i) {
              if (this.productList[i].nombre_1.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].nombre_2.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].apellido_1.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].apellido_1.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].dni.indexOf(this.inputName)>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].ticket.indexOf(this.inputName)>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].f_alta.indexOf(this.inputName)>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].user_id2.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }
            }

            // this.productList.forEach(element => {
            //     if(element.nombre.toUpperCase().indexOf(this.inputName.toUpperCase())>=0){
            //       this.filteredItems.push(element);
            //    }
            // });
      }else{
         this.filteredItems = this.productList;
      }
      console.log(this.filteredItems);
      this.init();
   }
   fillArray(): any{
      var obj = new Array();
      for(var index = this.pageStart; index< this.pageStart + this.pages; index ++) {
                  obj.push(index);
      }
      return obj;
   }
   refreshItems(){
               this.items = this.filteredItems.slice((this.currentIndex - 1)*this.pageSize, (this.currentIndex) * this.pageSize);
               this.pagesIndex =  this.fillArray();
   }
   prevPage(){
      if(this.currentIndex>1){
         this.currentIndex --;
      } 
      if(this.currentIndex < this.pageStart){
         this.pageStart = this.currentIndex;
      }
      this.refreshItems();
   }
   nextPage(){
      if(this.currentIndex < this.pageNumber){
            this.currentIndex ++;
      }
      if(this.currentIndex >= (this.pageStart + this.pages)){
         this.pageStart = this.currentIndex - this.pages + 1;
      }
 
      this.refreshItems();
   }
    setPage(index : number){
         this.currentIndex = index;
         this.refreshItems();
    }

}
