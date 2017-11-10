import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { RutaService } from '../services/ruta.service';



declare const $: any;

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
  public ver=true;
  public verDatos=false;
  public verEditar=false;
  public user_id = localStorage.getItem("manappger_user_id");
  public registroClienteForm: FormGroup;
  public sucursal:any;
  public carteras:any;
  public ticket:any;
  public fechaSistema:any;
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

    constructor(private http: HttpClient, private builder: FormBuilder, private ruta: RutaService) {
        this.registroClienteForm = builder.group({
            id: [""],
            tipo: ["", Validators.required],
            tipoNombre: [""],
            nombre_1: ["", Validators.required],
            nombre_2: [""],
            apellido_1: ["", Validators.required],
            apellido_2: [""],
            dni: ["", Validators.required],
            direccion: [""],
            f_nacimiento: ["", Validators.required],
            estado: ["", Validators.required],
            sexo: [""],
            cuota: [""],
            correo: [""],
            telefono: [""],
            f_alta: ["", Validators.required],
            moroso:[false],
            cuotas:this.builder.array([this.cuotaArray()]),
            sucursal: [""],
            sucursal_id: ["", Validators.required],
            cartera_id: ["", Validators.required],
            cartera: [""],
            ticket: [""],
            ticket_id: ["", Validators.required],
            ticket_id_viejo: [""],
            f_moroso: [""],
            user_id: [this.user_id],
            imagenes: [""],
            mes_moroso: [""],
            ano_moroso: [""],
            familiares: this.builder.array([this.familiaresArray()])
        })
    }

    cuotaArray(){
        return this.builder.group({
            Enero: [],
            Febrero: [],
            Marzo: [],
            Abril: [],
            Mayo: [],
            Junio: [],
            Julio: [],
            Agosto: [],
            Septiembre: [],
            Octubre: [],
            Noviembre: [],
            Diciembre: []
            })
    }


    familiaresArray(){
        return this.builder.group({
            id: [""],
            nombre_1: [""],
            nombre_2: [""],
            apellido_1: [""],
            apellido_2: [""],
            dni: [""],
            direccion: [""],
            f_nacimiento: [""],
            sexo: [""],
            vinculo: [""],
            observaciones: [""],
            existe: false
            })
    }

    ngOnInit(): void {
      
      this.loading=true;
      this.http.get(this.ruta.get_ruta()+'public/sucursales/1/carteras')
           .toPromise()
           .then(
           data => {

               this.data=data;
               this.data=this.data.sucursal[0];
               this.sucursal=this.data.nombre;
               this.registroClienteForm.patchValue({sucursal: this.sucursal });
               this.carteras=this.data.carteras;
               console.log(this.data);
               console.log(this.carteras);
               console.log(this.sucursal);
               const control= this.registroClienteForm.controls;
               var esMoroso=control.moroso.value;
               this.registroClienteForm.patchValue({sucursal_id: localStorage.getItem("manappger_user_sucursal_id") });
            },
           msg => { // Error
             console.log(msg.error.error);
           });
      this.http.get(this.ruta.get_ruta()+'public/clientes/familiares?sucursal_id='+localStorage.getItem('manappger_user_sucursal_id'))
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.data2 = data;
             this.socios=data;
             this.socios=this.socios.clientes;
             /*for (var i = 0; i < this.socios.length; i++) {

               if (this.socios[i].f_nacimiento=='0000-00-00'||this.socios[i].f_nacimiento==null) {
                 this.socios[i].f_nacimiento='';
               }
               if (this.socios[i].f_alta=='0000-00-00'||this.socios[i].f_alta==null) {
                 this.socios[i].f_nacimiento='';
               }

             }*/
             this.data=this.socios;
             console.log(this.socios);
             
             this.productList = this.data;
             this.filteredItems = this.productList;
             console.log(this.productList);



             for (var i = 0; i < this.productList.length; ++i) {

               this.productList[i].nFamiliares=this.productList[i].familiares.length;

               if (this.productList[i].tipo=='AF_CUETO') {
                 this.productList[i].tipo2='GFS';
               }else if (this.productList[i].tipo=='AF_CUETO_S') {
                 this.productList[i].tipo2='SSF';
               }
               if (this.productList[i].estado=='M') {
                 this.productList[i].estado2='Moroso';
               }else if (this.productList[i].estado=='V') {
                 this.productList[i].estado2='Vigente';
               }else if (this.productList[i].estado=='B') {
                 this.productList[i].estado2='Baja';
               }else if (this.productList[i].estado=='PC') {
                 this.productList[i].estado2='Pre Cargado';
               }else if (this.productList[i].estado=='P') {
                 this.productList[i].estado2='Pendiente por autorización';
               }

               if(this.productList[i].user_id==1) {
                 this.productList[i].user_id2='Araceli';
               }else if (this.productList[i].user_id=='2') {
                 this.productList[i].user_id2='Natalia';
               }

                this.productList[i].ticket=this.productList[i].ticket.toString();
             }

             this.init();
             
             this.loading=false;
           },
           msg => { // Error
             console.log(msg.error.error);

             this.loading=false;
           }
         );
      
      this.http.get('http://vivomedia.com.ar/cuetociasrl/cuetoAPI/public/getHour')
           .toPromise()
           .then(
           data => {
             console.log(data);
               this.fechaSistema=data;
               this.fechaSistema=this.fechaSistema.fechaSistema;
               //alert(this.fechaSistema);
            },
           msg => { // Error
             console.log(msg.error.error);
           });
    }

     update_tipo(tipo){
        var tipo_cliente = tipo.target.value;
        console.log(tipo_cliente);
        if (tipo_cliente == 'AF_CUETO_S') {

            this.registroClienteForm.removeControl('familiares');
            this.registroClienteForm.patchValue({tipoNombre: 'SSF' });
            //alert('AF_CUETO_S');
        }
        if (tipo_cliente == 'AF_CUETO') {
            this.registroClienteForm.addControl('familiares', this.builder.array([this.familiaresArray()]));
            this.registroClienteForm.patchValue({tipoNombre: 'GSF' });
            //alert('AF_CUETO');
        }  
    }
    getTicket(ticket_id) {
      for (var i = 0; i < this.carteras.length; ++i) {

        if (this.carteras[i].id==ticket_id) {
                    console.log(this.carteras[i]);
          this.registroClienteForm.patchValue({cartera: this.carteras[i].descripcion });
          this.ticket=this.carteras[i].tickets;
          console.log(ticket_id);
        }
      }
    }


    setTicket(tic) {
      console.log(tic);

      for (var i = 0; i < this.carteras.length; i++) {
        for (var j = 0; j < this.carteras[i].tickets.length; j++) {
          if (this.carteras[i].tickets[j].id==tic) {
            console.log(this.carteras[i].tickets[j].ticket);
            this.registroClienteForm.patchValue({ticket_id: tic });
            this.registroClienteForm.patchValue({ticket: this.carteras[i].tickets[j].ticket });
            //alert(this.ticket);
          }
        }
      }
    }
    getTicket2(ticket_id) {
      for (var i = 0; i < this.carteras.length; ++i) {

        if (this.carteras[i].id==ticket_id.target.value) {
                    console.log(this.carteras[i]);
          this.registroClienteForm.patchValue({cartera: this.carteras[i].descripcion });
          this.ticket=this.carteras[i].tickets;
          console.log(ticket_id.target.value);
        }
      }
    }


    setTicket2(tic) {
      console.log(tic.target.value);

      for (var i = 0; i < this.carteras.length; i++) {
        for (var j = 0; j < this.carteras[i].tickets.length; j++) {
          if (this.carteras[i].tickets[j].id==tic.target.value) {
            console.log(this.carteras[i].tickets[j].ticket);
            this.registroClienteForm.patchValue({ticket_id: tic.target.value });
            this.registroClienteForm.patchValue({ticket: this.carteras[i].tickets[j].ticket });
            //alert(this.ticket);
          }
        }
      }
    }

    getUsuario(item){
        this.ver=false;
        this.verDatos=true;
        this.formCliente=item;    
    }
    editar(item){
        console.log(item);
        
        // item.f_nacimiento=new Date(item.f_nacimiento);
        // item.f_alta=new Date(item.f_alta);
        // item.f_moroso=new Date(item.f_moroso);

        if (item.f_nacimiento=='0000-00-00'||item.f_nacimiento==null) {
          item.f_nacimiento="";
        }
        if (item.f_alta=='0000-00-00'||item.f_alta==null) {
          item.f_alta="";
        }
        if (item.f_moroso=='0000-00-00'||item.f_moroso==null) {
          item.f_moroso="";
        }

        if (item.familiares.length>0) {
          for (var j = 0; j < item.familiares.length; j++) {
            if (item.familiares[j].f_nacimiento=='0000-00-00'||item.f_moroso==null) {
              item.familiares[j].f_nacimiento="";
              //item.familiares[j].f_nacimiento=new Date(item.familiares[j].f_nacimiento);
            }
            
          }
        }

        this.registroClienteForm = this.builder.group({
            id: [""],
            tipo: [""],
            tipoNombre: [""],
            nombre_1: [""],
            nombre_2: [""],
            apellido_1: [""],
            apellido_2: [""],
            dni: [""],
            direccion: [""],
            f_nacimiento: [""],
            estado: [""],
            sexo: [""],
            cuota: [""],
            correo: [""],
            telefono: [""],
            f_alta: [""],
            moroso:[false],
            cuotas:this.builder.array([this.cuotaArray()]),
            sucursal: [""],
            sucursal_id: [""],
            cartera_id: [""],
            cartera: [""],
            ticket: [""],
            ticket_id: [""],
            ticket_id_viejo: [""],
            f_moroso: [""],
            user_id: [this.user_id],
            imagenes: [""],
            mes: [""],
            anio: [""],
            mes_moroso: [""],
            ano_moroso: [""],
            familiares: this.builder.array([this.familiaresArray()])
        })

        if (item.moroso==0) {
          item.moroso=false;
        }else if (item.moroso==1) {
          item.moroso=true;
        }

        this.ver=false;
        this.verEditar=true; 
        this.formCliente=item;
        this.registroClienteForm.patchValue({id: item.id });
        this.registroClienteForm.patchValue({tipo: item.tipo });
        this.registroClienteForm.patchValue({tipoNombre: item.tipo2 });
        this.registroClienteForm.patchValue({nombre_1: item.nombre_1 });
        this.registroClienteForm.patchValue({nombre_2: item.nombre_2 });
        this.registroClienteForm.patchValue({apellido_1: item.apellido_1 });
        this.registroClienteForm.patchValue({apellido_2: item.apellido_2 });
        this.registroClienteForm.patchValue({dni: item.dni });
        this.registroClienteForm.patchValue({direccion: item.direccion });
        this.registroClienteForm.patchValue({f_nacimiento: item.f_nacimiento });
        this.registroClienteForm.patchValue({estado: item.estado });
        this.registroClienteForm.patchValue({sexo: item.sexo });
        this.registroClienteForm.patchValue({cuota: item.cuota });
        this.registroClienteForm.patchValue({correo: item.correo });
        this.registroClienteForm.patchValue({telefono: item.telefono });
        this.registroClienteForm.patchValue({f_alta: item.f_alta });
        this.registroClienteForm.patchValue({f_moroso: item.f_moroso });
        this.registroClienteForm.patchValue({moroso: item.moroso });
        this.registroClienteForm.patchValue({sucursal: item.sucursal });
        this.registroClienteForm.patchValue({sucursal_id: item.sucursal_id });
        this.registroClienteForm.patchValue({cartera_id: item.cartera_id });
        this.registroClienteForm.patchValue({cartera: item.cartera });
        this.registroClienteForm.patchValue({ticket: item.ticket });
        this.registroClienteForm.patchValue({ticket_id: item.ticket_id });
        this.registroClienteForm.patchValue({ticket_id_viejo: item.ticket_id });
        this.registroClienteForm.patchValue({imagenes: item.imagenes });
        this.registroClienteForm.patchValue({mes_moroso: item.mes_moroso });
        this.registroClienteForm.patchValue({ano_moroso: item.ano_moroso });

        this.getTicket(item.cartera_id);
        this.setTicket(item.ticket_id);

        for (var i = 1; i < item.familiares.length; i++) {
          (<FormArray>this.registroClienteForm.controls['familiares']).push(this.familiaresArray());
        }
       
        for (var i = 0; i < item.familiares.length; i++) {
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({id: item.familiares[i].id });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({nombre_1: item.familiares[i].nombre_1 });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({nombre_2: item.familiares[i].nombre_2 });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({apellido_1: item.familiares[i].apellido_1 });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({apellido_2: item.familiares[i].apellido_2 });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({dni: item.familiares[i].dni });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({direccion: item.familiares[i].direccion });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({f_nacimiento: item.familiares[i].f_nacimiento });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({sexo: item.familiares[i].sexo });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({vinculo: item.familiares[i].vinculo });
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({observaciones: item.familiares[i].observaciones});
            (<FormArray>this.registroClienteForm.controls['familiares']).at(i).patchValue({existe: true});
        }
    }

    agregar(){
        const control= <FormArray>this.registroClienteForm.controls["familiares"];
        var index=control.value.length-1;
        
        control.push(this.familiaresArray());
        
    }
    crearFamiliar(cliente,cliente_id,sucursal_id){

      cliente.value.cliente_id=cliente_id;
      cliente.value.sucursal_id=sucursal_id;

      this.http.post(this.ruta.get_ruta()+'public/familiares',cliente.value)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.showNotification('top','center','Familiar creado con exito',2);
             this.loading=false;
             this.restaurar();
           },
           msg => { // Error
             console.log(msg);
             this.showNotification('top','center','Ha ocurrido un error' + JSON.stringify(msg.error),4);
             this.loading=false;
           }
         );
    }

    restaurar(){
      this.loading=true;
      this.http.get(this.ruta.get_ruta()+'public/clientes/familiares?sucursal_id='+localStorage.getItem('manappger_user_sucursal_id'))
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.data2 = data;
             this.socios=data;
             this.socios=this.socios.clientes;
             /*for (var i = 0; i < this.socios.length; i++) {

               if (this.socios[i].f_nacimiento=='0000-00-00'||this.socios[i].f_nacimiento==null) {
                 this.socios[i].f_nacimiento='';
               }
               if (this.socios[i].f_alta=='0000-00-00'||this.socios[i].f_alta==null) {
                 this.socios[i].f_nacimiento='';
               }

             }*/
             this.data=this.socios;
             console.log(this.socios);
             
             this.productList = this.data;
             this.filteredItems = this.productList;
             console.log(this.productList);



             for (var i = 0; i < this.productList.length; ++i) {

               this.productList[i].nFamiliares=this.productList[i].familiares.length;

               if (this.productList[i].tipo=='AF_CUETO') {
                 this.productList[i].tipo2='GFS';
               }else if (this.productList[i].tipo=='AF_CUETO_S') {
                 this.productList[i].tipo2='SSF';
               }
               if (this.productList[i].estado=='M') {
                 this.productList[i].estado2='Moroso';
               }else if (this.productList[i].estado=='V') {
                 this.productList[i].estado2='Vigente';
               }else if (this.productList[i].estado=='B') {
                 this.productList[i].estado2='Baja';
               }else if (this.productList[i].estado=='PC') {
                 this.productList[i].estado2='Pre Cargado';
               }else if (this.productList[i].estado=='P') {
                 this.productList[i].estado2='Pendiente por autorización';
               }

               if(this.productList[i].user_id==1) {
                 this.productList[i].user_id2='Araceli';
               }else if (this.productList[i].user_id=='2') {
                 this.productList[i].user_id2='Natalia';
               }

                this.productList[i].ticket=this.productList[i].ticket.toString();
             }

             this.init();
             
             this.loading=false;
           },
           msg => { // Error
             console.log(msg.error.error);
             alert('error, por favor recargar la pagina.');
             this.loading=false;
           }
         );
    }

    editarAfiliado(familiar){
      console.log(familiar.value);
      this.loading=true;
      this.http.put(this.ruta.get_ruta()+'public/clientes/'+familiar.value.id,familiar.value)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.showNotification('top','center','Actualizado con exito',2);
             this.loading=false;
             this.restaurar();
           },
           msg => { // Error
             console.log(msg);
             this.showNotification('top','center','Ha ocurrido un error' + JSON.stringify(msg.error),4);
             this.loading=false;
           }
         );
    }

    editarFamiliar(familiar){
      console.log(familiar);
      this.loading=true;
      this.http.put(this.ruta.get_ruta()+'public/familiares/'+familiar.value.id,familiar.value)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.showNotification('top','center','Actualizado con exito',2);
             this.loading=false;
             this.restaurar();
           },
           msg => { // Error
             console.log(msg);
             this.showNotification('top','center','Ha ocurrido un error' + JSON.stringify(msg.error),4);
             this.loading=false;
           }
         );
    }

    public verEstado(estado) {
      console.log(estado.target.value);
        if (estado.target.value=='PC') {
          this.registroClienteForm.patchValue({mes: "" });
          this.registroClienteForm.patchValue({anio: "" });
        }else if(estado.target.value=='P') {
          this.registroClienteForm.patchValue({mes: "" });
          this.registroClienteForm.patchValue({anio: "" });
        }else if(estado.target.value=='V') {
          var diaActual=new Date(this.fechaSistema);
          this.registroClienteForm.patchValue({mes: diaActual.getMonth()+1 });
          this.registroClienteForm.patchValue({anio: diaActual.getFullYear() });
        }else if (estado.target.value=='M') {
          this.registroClienteForm.patchValue({mes: "" });
          this.registroClienteForm.patchValue({anio: "" });
        }else if (estado.target.value=='B') {
          this.registroClienteForm.patchValue({mes: "" });
          this.registroClienteForm.patchValue({anio: "" });
        }
        console.log(this.registroClienteForm.value);
    }

    uppercase(value: string) {
      return value.toUpperCase();
    }
    uploadFile: any;
    hasBaseDropZoneOver: boolean = false;
    options: Object = {
      url: 'http://vivomedia.com.ar/cuetociasrl/upload.php'
    };
    sizeLimit = 2000000;
    handleUpload(data): void {
      if (data && data.response) {
        data = JSON.parse(data.response);
        this.uploadFile = data;
        this.loading=false;
        this.registroClienteForm.patchValue({imagenes: 'http://vivomedia.com.ar/cuetociasrl/uploads/'+this.uploadFile.generatedName });
      }
    }
   
    fileOverBase(e:any):void {
      console.log('t1');
      this.hasBaseDropZoneOver = e;
    }
   
    beforeUpload(uploadingFile): void {
      this.loading=true;
      console.log('t2');
      if (uploadingFile.size > this.sizeLimit) {
        uploadingFile.setAbort();
        alert('File is too large');

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

    volver(){
        this.ver=true;
        this.verDatos=false;
        this.verEditar=false;
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
