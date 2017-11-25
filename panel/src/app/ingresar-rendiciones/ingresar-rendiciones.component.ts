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

	constructor(private http: HttpClient, private builder: FormBuilder, private ruta: RutaService) { }

	ngOnInit() {
		this.loading=true;
		this.http.get(this.ruta.get_ruta()+'public/recibos?estado=E')
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
            	this.recibos=data;
             this.recibos=this.recibos.recibos;
             for (var i = 0; i < this.recibos.length; ++i) {
             	this.recibos[i].mes=this.meses(this.recibos[i].mes);
             }
             this.productList = this.recibos;
             this.filteredItems = this.productList;
             
             this.init();

             this.loading=false;
             //this.showNotification('top','center','Actualizado con exito',2);
           },
           msg => { // Error
            
             console.log(msg.error.error);

             this.loading=false;
             this.showNotification('top','center',JSON.stringify(msg.error.error),1);
           }
         );
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
