import { Component, OnInit,HostListener, NgZone } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl  } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { RutaService } from '../services/ruta.service';


declare const $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

    ESCAPE_KEYCODE = 27;
    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.keyCode === this.ESCAPE_KEYCODE) {
            if (this.loading==true) {
            console.log(event.keyCode);
            window.location.reload();
          }  
        }
    }

    public startDate = new Date(1990, 0, 1);
    public maxDate = new Date();
    public data: any;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "nombre";
    public sortOrder = "asc";
    public usuarios:any;
    public registroClienteForm: FormGroup;
    public clientesAdd:any;
    public token = localStorage.getItem("manappger_token");
    public user_id = localStorage.getItem("manappger_user_id");
    public sucursal :any;
    public ano: any;
    public mes: any;
    public banderaCheck=1;
    public estadoMoroso='No';
    public sucursal_id:any;
    public carteras:any;
    public cartera:any;
    public cartera_id:any;
    public ticket:any;
    public ticketSelector:any;
    public tickets:any;
    public tipo='';
    public loading = false;
    public moroso = false;
    public telefono = "";
    public correo = "";
    public fechaSistema:any;
    private zone: NgZone;
    public progress: number = 0;
    public imagen:any;
    uploadFile: any;
    hasBaseDropZoneOver: boolean = false;
    options: Object = {
      url: 'http://vivomedia.com.ar/cuetociasrl/upload.php'
    };
    sizeLimit = 2000000;

    private formSumitAttempt: boolean;


    constructor(private http: HttpClient, private builder: FormBuilder, private ruta: RutaService) {

        this.registroClienteForm = builder.group({
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
            f_pago:["", Validators.required],
            moroso:[false],
            cuotas:this.builder.array([this.cuotaArray()]),
            sucursal: [""],
            sucursal_id: ["", Validators.required],
            cartera_id: ["", Validators.required],
            cartera: [""],
            ticket: [""],
            ticket_id: ["", Validators.required],
            f_moroso: [""],
            user_id: [this.user_id],
            imagenes: [""],
            mes: [""],
            anio: [""],
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
            nombre_1: ["", Validators.required],
            nombre_2: [""],
            apellido_1: ["", Validators.required],
            apellido_2: [""],
            dni: ["", Validators.required],
            direccion: [""],
            f_nacimiento: ["", Validators.required],
            sexo: [""],
            vinculo: [""],
            observaciones: [""]
            })
    }



    ngOnInit(): void {
      this.loading=true;
      this.zone = new NgZone({ enableLongStackTrace: false });
      this.http.get(this.ruta.get_ruta()+'public/sucursales/'+localStorage.getItem("manappger_user_sucursal_id")+'/carteras')
           .subscribe((data)=> {

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


               this.loading=false;
            });
       this.http.get(this.ruta.get_ruta()+'public/getHour')
           .subscribe((data)=> {
             console.log(data);
               this.fechaSistema=data;
               this.fechaSistema=this.fechaSistema.fechaSistema;
               //alert(this.fechaSistema);
            });
           
    }

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


    uppercase(value: string) {
      return value.toUpperCase();
    }
    public loading2: boolean = true;
    public loading3: boolean = false;
    onLoad() {
        this.loading2 = false;
    }
    handleUpload(data): void {
      if (data && data.response) {
        data = JSON.parse(data.response);
        this.uploadFile = data;
        this.loading=false;
        this.registroClienteForm.patchValue({imagenes: 'http://vivomedia.com.ar/cuetociasrl/uploads/'+this.uploadFile.generatedName });
        this.progress=0;
        this.loading2 = true;
        this.imagen='http://vivomedia.com.ar/cuetociasrl/uploads/'+this.uploadFile.generatedName;
      }
      this.zone.run(() => {
        this.progress = Math.floor(data.progress.percent );
      });
    }
   
    fileOverBase(e:any):void {
      console.log('t1');
      this.hasBaseDropZoneOver = e;
    }
   
    beforeUpload(uploadingFile): void {
      //this.loading=true;
      this.loading3=true;
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

    public getTicket(ticket_id) {
      for (var i = 0; i < this.carteras.length; ++i) {

        if (this.carteras[i].id==ticket_id.target.value) {
                    console.log(this.carteras[i]);
          this.registroClienteForm.patchValue({cartera: this.carteras[i].descripcion });
          this.ticket=this.carteras[i].tickets;
          console.log(ticket_id.target.value);
        }
      }
    }

    public setTicket(tic) {
      console.log(tic.target.value);

      for (var i = 0; i < this.carteras.length; i++) {
        for (var j = 0; j < this.carteras[i].tickets.length; j++) {
          if (this.carteras[i].tickets[j].id==tic.target.value) {
            console.log(this.carteras[i].tickets[j].ticket);
            this.registroClienteForm.patchValue({ticket: this.carteras[i].tickets[j].ticket });
            //alert(this.ticket);
          }
        }
      }
    }
    public compFechPago(){
      
      console.log(this.registroClienteForm.value.f_pago);
      console.log(this.registroClienteForm.value.f_alta);
      var d1= new Date(this.registroClienteForm.value.f_pago);
      var d2= new Date(this.registroClienteForm.value.f_alta);

      if(d1.getTime()<=d2.getTime()){
        alert('La fecha de pago no puede ser menor que la de alta.');
      }else{
        //alert('si sirve');
      }
    }

    enviarCliente(model){
      this.formSumitAttempt = true;
    if (this.registroClienteForm.valid) {
      console.log('form submitted');
    
        this.clientesAdd=model;
        console.log(this.clientesAdd.value);
        var send=this.clientesAdd.value;
        var send2 = Object.assign({}, send);
        send2.user_id=localStorage.getItem("manappger_user_id");

        //setTimeout(function() {
          //send.familiares=JSON.stringify(send.familiares);
          //send.cuotas=JSON.stringify(send.coutas);

          var me=send2.familiares;
          console.log(me);

          var me2=send2.cuotas[0].Enero;
          console.log(me2);

        //}, 1000);
        send2.familiares=JSON.stringify(send2.familiares);
         // send.cuotas=JSON.stringify(send.cuotas);
          // send=JSON.stringify(send);
          console.log(send2);

        this.http.post(this.ruta.get_ruta()+'public/clientes',send2)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             // alert('exito');
             this.showNotification('top','center','Cliente registrado con exito',2);
             this.registroClienteForm.reset();
             this.resetCliente();
           },
           msg => { // Error
             console.log(msg);
             // alert('error');
             this.showNotification('top','center','Ha ocurrido un error' + JSON.stringify(msg.error),4);
             this.registroClienteForm.reset();
           }
         );
      }
    }

    agregar(){
        const control= <FormArray>this.registroClienteForm.controls["familiares"];
        var index=control.value.length-1;
        if (control.value[index].nombre_1=='') {
            alert('Completa los datos del Familiar anterior');
        }else{
            control.push(this.familiaresArray());
        }
    }

    remover(i){
        const control= <FormArray>this.registroClienteForm.controls["familiares"];
        var index=control.value.length-1;
        control.removeAt(index);
    }

    setDireccion(){
      setTimeout(()=>{
        var control= <FormArray>this.registroClienteForm.controls["familiares"];
        var tam=control.value.length;
        console.log(tam);
        console.log(this.registroClienteForm.value);
        (<FormArray>this.registroClienteForm.controls['familiares']).at(tam-1).patchValue({direccion: this.registroClienteForm.value.direccion });
      },500)
    }

    update_tipo(tipo){
      console.log(this.registroClienteForm);
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

    public resetCliente(){
        this.resetCliente2();
        this.loading=true;
        this.registroClienteForm.patchValue({user_id: localStorage.getItem("manappger_user_id") });
        this.registroClienteForm.patchValue({sucursal: this.sucursal });
        this.carteras=[];
        this.ticket=[];

        this.http.get(this.ruta.get_ruta()+'public/sucursales/1/carteras')
           .subscribe((data)=> {
               this.loading=false;
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
               

               
            });
      
      // setTimeout(() => {
      //   this.registroClienteForm.reset();
      // },200);
    }
    public resetCliente2(){
      setTimeout(() => {
        this.loading=false;
      },10000);
    }
    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    public remove(item) {
        let index = this.data.indexOf(item);
        if(index>-1) {
            this.data.splice(index, 1);
        }
    }
    public verEstado() {
      setTimeout(() => {
        const control = this.registroClienteForm.controls;
        var estado=control.estado.value;
        console.log(estado);
        if (estado=='PC') {
          this.registroClienteForm.patchValue({mes: "" });
          this.registroClienteForm.patchValue({anio: "" });
        }else if(estado=='P') {
          this.registroClienteForm.patchValue({mes: "" });
          this.registroClienteForm.patchValue({anio: "" });
        }else if(estado=='V') {
          var diaActual=new Date(this.fechaSistema);
          this.registroClienteForm.patchValue({mes: diaActual.getMonth()+1 });
          this.registroClienteForm.patchValue({anio: diaActual.getFullYear() });
        }else if (estado=='M') {
          const control = this.registroClienteForm.controls;
          var f_pago=new Date(control.f_pago.value);
          this.registroClienteForm.patchValue({mes: f_pago.getMonth()+1 });
          this.registroClienteForm.patchValue({anio: f_pago.getFullYear() });
        }else if (estado=='B') {
          this.registroClienteForm.patchValue({mes: "" });
          this.registroClienteForm.patchValue({anio: "" });
        }
        console.log(this.registroClienteForm.value);
      }, 1500);
    }
    public setMesAnio() {
      setTimeout(() => {
        
        const control = this.registroClienteForm.controls;
        var f_pago=new Date(control.f_pago.value);
        this.registroClienteForm.patchValue({mes: f_pago.getMonth()+1 });
        this.registroClienteForm.patchValue({anio: f_pago.getFullYear() });
        
        console.log(this.registroClienteForm.value);
      }, 1500);
    }
    public checkarSiEsMoroso(){
      setTimeout(() => {
        const control = this.registroClienteForm.controls;
        var f_pago=new Date(control.f_pago.value);
        console.log(f_pago);
        var fSistema=new Date(this.fechaSistema);
        console.log(fSistema);

        var mesPago=f_pago.getMonth();
        var mesSistema=fSistema.getMonth();
        var meses=[1,2,3,4,5,6,7,8,9,10,11,12];
        var i1=0;
        var i2=0;

        for (var i = 0; i < meses.length; ++i) {
          if(meses[i]==mesPago) {
            i1=i;
          }
          if(meses[i]==mesSistema) {
            i2=i;
          }
        }

        var diffmes=i2-i1;
        console.log(diffmes);
        if(diffmes>=2){
          this.registroClienteForm.patchValue({moroso: true });
          this.registroClienteForm.patchValue({estado: 'M' });
        }else{
          this.registroClienteForm.patchValue({moroso: false });
          this.registroClienteForm.patchValue({estado: '' });
        }
        

      }, 500); 
    }

    public chekarMoroso() {
        
        setTimeout(() => {
            const control= this.registroClienteForm.controls;
            var esMoroso=control.moroso.value;
         
            if (this.banderaCheck==0) {
                if (esMoroso==true) {
                    this.registroClienteForm.patchValue({estado: 'M' });
                    this.banderaCheck=1;
                    this.estadoMoroso='Si';
                }else{
                    this.registroClienteForm.patchValue({estado: '' });
                    this.estadoMoroso='No';
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });

                }
            }else{
                if (esMoroso==true) {
                    this.registroClienteForm.patchValue({estado: 'M' });
                    //this.chekar();
                    this.estadoMoroso='Si';
                }else{
                    this.registroClienteForm.patchValue({estado: '' });
                    this.estadoMoroso='No';
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: true });
                       (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: true });
                }
                
            }
        }, 500); 

       
    }

    public actual(fecha) {
       // (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: false });
       console.log(fecha);
       var diaActual = new Date(fecha);
       var mesActual = diaActual.getMonth();
       var anoActual = diaActual.getFullYear();
       mesActual=mesActual+1;
       this.mes=mesActual;
       this.ano=anoActual;
       this.registroClienteForm.patchValue({mes_moroso: mesActual });
       this.registroClienteForm.patchValue({ano_moroso: anoActual });

       console.log(mesActual);
       console.log(anoActual);
       if (true) {
               if (mesActual==1) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
               }
               if (mesActual==2) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesActual==3) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesActual==4) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesActual==5) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesActual==6) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesActual==7) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesActual==8) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesActual==9) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesActual==10) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesActual==11) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
               }
               if (mesActual==12) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: true });
               }           
            }
    }
    public chekar() {
       // (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: false });
       var diaActual = new Date();
       var mesActual = diaActual.getMonth();
       var anoActual = diaActual.getFullYear();
       this.ano=anoActual;
       console.log(anoActual);
       var formulario = <FormArray>this.registroClienteForm.controls['cuotas'];
       console.log(formulario.value);
       
       setTimeout(() => {
           const control= this.registroClienteForm.controls;
           var fecha=control.cuota.value;
           console.log(fecha);

           var diaAlta= new Date(fecha);
           var mesAlta = diaAlta.getMonth();
           var anoAlta = diaAlta.getFullYear();
           console.log(mesAlta);
           mesAlta=mesAlta+1;
           console.log(mesAlta);
           if (anoActual==anoAlta) {
               if (mesAlta==1) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
               }
               if (mesAlta==2) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==3) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==4) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==5) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==6) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==7) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==8) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==9) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==10) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==11) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
               }
               if (mesAlta==12) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: true });
               }           
            }else{
                if (mesAlta==1) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
               }
               if (mesAlta==2) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==3) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==4) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==5) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==6) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==7) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==8) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==9) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==10) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: false });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
                   
               }
               if (mesAlta==11) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: false });
               }
               if (mesAlta==12) {
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Enero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Febrero: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Marzo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Abril: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Mayo: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Junio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Julio: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Agosto: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Septiembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Octubre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Noviembre: true });
                   (<FormArray>this.registroClienteForm.controls['cuotas']).at(0).patchValue({Diciembre: true });
               }  
            }

        }, 500); 
    }

}