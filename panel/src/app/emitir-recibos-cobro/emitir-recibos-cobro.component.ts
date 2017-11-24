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
    public verCarteras=true;
    public verRecibos=false;
    public verRecibo=false;
    public generados=false;
    public generarRecibos=false;
    public idRecibo:any;
    public nombreCartera:any;
    public numeroCartera:any;
    public recibos:any;

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

               	for (var i = 0; i < this.data.carteras.length; i++) {
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
  ir(id,name,number){
    console.log(id);
    this.idRecibo=id;
    this.verCarteras=false;
    this.verRecibos=true;
    this.verRecibo=false;
    this.nombreCartera=name;
    this.numeroCartera=number;

    this.loading=true;
    this.http.get(this.ruta.get_ruta()+'public/recibos/'+id)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.recibos=data;
             this.productList = this.data;
             this.filteredItems = this.productList;
             
             this.init();
             this.generados=true;
             this.loading=false;
             //this.showNotification('top','center','Actualizado con exito',2);
           },
           msg => { // Error
             this.generarRecibos=true;
             console.log(msg.error.error);

             this.loading=false;
             this.showNotification('top','center',JSON.stringify(msg.error.error),1);
           }
         );
  }
  generarRecibo(){
    var send={};
    this.loading=true;
    this.http.post(this.ruta.get_ruta()+'public/recibos/'+this.idRecibo,send)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.showNotification('top','center','Los recibos se han creado con exito',2);
             this.loading=false;
           },
           msg => { // Error
             console.log(msg);
             this.showNotification('top','center',JSON.stringify(msg.error.error),4);
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
