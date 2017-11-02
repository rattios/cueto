import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';

@Component({
  selector: 'app-afiliados',
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.css']
})
export class AfiliadosComponent implements OnInit {

  private data:any;
  //private data:any;
  public data2:any;
  public socios:any;
  public productList:any;
  public loading=false;
  public formCliente = {
            tipo: "",
            nombre_1: "",
            nombre_2: "",
            apellido_1: "",
            apellido_2: "",
            dni: "",
            direccion: "",
            f_nacimiento: "",
            estado: "",
            sexo: "",
            cuota: "",
            f_alta: "",
            moroso:"",
            cuotas:[{
              Enero: true,
              Febrero: true,
              Marzo: true,
              Abril: true,
              Mayo: true,
              Junio: true,
              Julio: true,
              Agosto: true,
              Septiembre: true,
              Octubre: true,
              Noviembre: true,
              Diciembre: true
            }],
            sucursal_id: "",
            cartera_id: "",
            ticket: "",
            f_moroso: "",
            user_id: localStorage.getItem("manappger_user_id"),
            familiares: [{
              visible: true,
              nombre_1: "",
              nombre_2: "",
              apellido_1: "",
              apellido_2: "",
              dni: "",
              direccion: "",
              f_nacimiento: "",
              sexo: "",
              vinculo: "",
              observaciones: ""
            }]
          };

    constructor(private http: HttpClient) {

    }

    ngOnInit(): void {
      this.loading=true;
      this.http.get('http://vivomedia.com.ar/cuetociasrl/cuetoAPI/public/clientes/familiares?sucursal_id='+localStorage.getItem('manappger_user_sucursal_id'))
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.data2 = data;
             this.socios=data;
             this.data=this.socios.clientes;
             console.log(this.socios);
             
             this.productList = this.data;
             this.filteredItems = this.productList;
             console.log(this.productList);
             for (var i = 0; i < this.productList.length; ++i) {
               if (this.productList[i].tipo=='AF_CUETO') {
                 this.productList[i].tipo2='Afiliado Cueto Grupo Familiar';
               }else if (this.productList[i].tipo=='AF_CUETO_S') {
                 this.productList[i].tipo2='Afiliado Cueto';
               }
               if (this.productList[i].estado=='M') {
                 this.productList[i].estado2='Moroso';
               }else if (this.productList[i].estado=='N') {
                 this.productList[i].estado2='Vigente';
               }else if (this.productList[i].estado=='B') {
                 this.productList[i].estado2='Baja';
               }
             }

             this.init();
             this.loading=false;
           },
           msg => { // Error
             console.log(msg.error.error);

             this.loading=false;
           }
         );
    }

    getUsuario(item){

        this.formCliente=item;
          
    }
   // -------------------------------------------------------------------------------------------------------------------
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
              }else if (this.productList[i].f_alta.indexOf(this.inputName)>=0) {
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
