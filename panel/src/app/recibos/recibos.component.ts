import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css']
})
export class RecibosComponent implements OnInit {

	@Input() recibos:any;

	constructor() { }

	ngOnInit() {
    console.log(this.recibos);
    if(this.recibos!=undefined) {
      this.productList = this.recibos;
      this.filteredItems = this.productList;
      this.init();
    }
		
	}

	public nAfiliado:any;
	public nRecibo:any;
	public cuotaMes:any;
	public detalle:any;
	public importe:any;
	public tipoAfiliado:any;
	public verRecibo=false;

	verDetalleRecibo(item){
	  	console.log(item);
	  	this.nAfiliado=item.cliente_id;
	  	this.nRecibo=item.num_recibo;
	  	this.cuotaMes=item.mes+'-'+item.anio;
	  	this.detalle=item.detalle;
	  	this.importe=item.importe;
	  	


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
	}
	checkNULL(item){
	  	if(item==null || item=='NULL' || item=='') {
			return '';
	  	}else{
			return item;
	  	}
	}

	volverVerRecibo(){
		this.verRecibo=false;
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
