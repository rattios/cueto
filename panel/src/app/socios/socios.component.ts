import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';

declare var $: any;

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit {


    public data: any;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "nombre";
    public sortOrder = "asc";
    public usuarios:any;
    public clientesAdd:any;
    public token = localStorage.getItem("manappger_token");
    public user_id = localStorage.getItem("manappger_user_id");
    public sucursal :any;
    public mes: any;
    public ano: any;
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
            // telefono: "",
            // correo: "",
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
      //this.loading=true;
      //localStorage.getItem("manappger_user_sucursal_id")
      this.http.get('http://vivomedia.com.ar/cuetociasrl/cuetoAPI/public/sucursales/1/carteras')
           .subscribe((data)=> {

               this.data=data;
               this.data=this.data.sucursal[0];
               this.sucursal=this.data.nombre;
               this.sucursal_id=this.data.id;
               this.formCliente.sucursal_id=this.data.id;
               this.carteras=this.data.carteras;
               console.log(this.data);
               console.log(this.carteras);
               console.log(this.sucursal);
               //const control= this.registroClienteForm.controls;
              // var esMoroso=control.moroso.value;
               //this.registroClienteForm.patchValue({sucursal_id: localStorage.getItem("manappger_user_sucursal_id") });


               this.loading=false;
            });
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

    public getTicket(ticket) {
      for (var i = 0; i < this.carteras.length; ++i) {

        if (this.carteras[i].id==ticket.target.value) {
          this.tickets=this.carteras[i].tickets;
          this.formCliente.cartera_id=ticket.target.value;
          this.cartera=this.carteras[i].numero;
          console.log(ticket.target.value);
          console.log(this.formCliente);
        }
      }
    }
    public setTicket(tic) {
      console.log(tic.target.value);
      this.formCliente.ticket=tic.target.value;
      console.log(this.formCliente);
      for (var i = 0; i < this.carteras.length; i++) {
        for (var j = 0; j < this.carteras[i].tickets.length; j++) {
          if (this.carteras[i].tickets[j].id==tic.target.value) {
            this.ticket=this.carteras[i].tickets[j].ticket;
            //alert(this.ticket);
          }
        }
      }
    }

    enviarCliente(){
        
       console.log(this.formCliente);

       var cuotas=[{
              Enero: "",
              Febrero: "",
              Marzo: "",
              Abril: "",
              Mayo: "",
              Junio: "",
              Julio: "",
              Agosto: "",
              Septiembre: "",
              Octubre: "",
              Noviembre: "",
              Diciembre: ""
            }];

       for (var i = 0; i < this.formCliente.cuotas.length; ++i) {
          if (this.formCliente.cuotas[i].Enero==true) {
            cuotas[i].Enero="1";
          }else{
            cuotas[i].Enero="0";
          }
          if (this.formCliente.cuotas[i].Febrero==true) {
            cuotas[i].Febrero="1";
          }else{
            cuotas[i].Febrero="0";
          }
          if (this.formCliente.cuotas[i].Marzo==true) {
            cuotas[i].Marzo="1";
          }else{
            cuotas[i].Marzo="0";
          }
          if (this.formCliente.cuotas[i].Abril==true) {
            cuotas[i].Abril="1";
          }else{
            cuotas[i].Abril="0";
          }
          if (this.formCliente.cuotas[i].Mayo==true) {
            cuotas[i].Mayo="1";
          }else{
            cuotas[i].Mayo="0";
          }
          if (this.formCliente.cuotas[i].Junio==true) {
            cuotas[i].Junio="1";
          }else{
            cuotas[i].Junio="0";
          }
          if (this.formCliente.cuotas[i].Julio==true) {
            cuotas[i].Julio="1";
          }else{
            cuotas[i].Julio="0";
          }
          if (this.formCliente.cuotas[i].Agosto==true) {
            cuotas[i].Agosto="1";
          }else{
            cuotas[i].Agosto="0";
          }
          if (this.formCliente.cuotas[i].Septiembre==true) {
            cuotas[i].Septiembre="1";
          }else{
            cuotas[i].Septiembre="0";
          }
          if (this.formCliente.cuotas[i].Octubre==true) {
            cuotas[i].Octubre="1";
          }else{
            cuotas[i].Octubre="0";
          }
          if (this.formCliente.cuotas[i].Noviembre==true) {
            cuotas[i].Noviembre="1";
          }else{
            cuotas[i].Noviembre="0";
          }
          if (this.formCliente.cuotas[i].Diciembre==true) {
            cuotas[i].Diciembre="1";
          }else{
            cuotas[i].Diciembre="0";
          }
       }
       if (this.moroso==false) {
         this.mes='';
         this.ano='';
       }

       var enviar = {
            tipo: this.formCliente.tipo,
            nombre_1: this.formCliente.nombre_1,
            nombre_2: this.formCliente.nombre_2,
            apellido_1: this.formCliente.apellido_1,
            apellido_2: this.formCliente.apellido_2,
            dni: this.formCliente.dni,
            direccion: this.formCliente.direccion,
            f_nacimiento: this.formCliente.f_nacimiento,
            estado: this.formCliente.estado,
            sexo: this.formCliente.sexo,
            cuota: this.formCliente.cuota,
            f_alta: this.formCliente.f_alta,
            f_moroso: this.formCliente.f_moroso,
            moroso:this.moroso,
            cuotas:JSON.stringify(cuotas),
            sucursal_id: localStorage.getItem("manappger_user_sucursal_id"),
            cartera_id: this.formCliente.cartera_id,
            ticket: this.formCliente.ticket,
            mes_moroso: this.mes,
            ano_moroso: this.ano,
            telefono: this.telefono,
            correo: this.correo,
            user_id: localStorage.getItem("manappger_user_id"),
            familiares: JSON.stringify(this.formCliente.familiares)
        };

          console.log(enviar);
        this.http.post('http://vivomedia.com.ar/cuetociasrl/cuetoAPI/public/clientes',enviar)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             // alert('exito');
             this.showNotification('top','center','Cliente registrado con exito',2);
             this.reset();
           },
           msg => { // Error
             console.log(msg);
             // alert('error');
             this.showNotification('top','center','Ha ocurrido un error ' + JSON.stringify(msg.error),4);
             //this.registroClienteForm.reset();
           }
         );

    }

    reset(){
      this.cartera_id="";
      this.ticketSelector="";
      this.estadoMoroso='No';
      this.tipo='';
      this.loading = false;
      this.moroso = false;
      this.telefono = "";
      this.correo = "";
      this.formCliente = {

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
        }
    }

    agregar(){
        var familias=[];
        for (var i = 0; i < this.formCliente.familiares.length; ++i) {
          this.formCliente.familiares[i].visible= false,
          familias.push(this.formCliente.familiares[i]);
        }
        
        familias.push({
              visible:true,
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
            });

        this.formCliente.familiares=[];
        setTimeout(()=>{    
            this.formCliente.familiares=familias;
       },30);
        
    }
    remover(i){
       //this.formCliente.familiares.slice(0,-1); 
       this.formCliente.familiares.splice(i, 1);
    }


    update_tipo(tipo){
        var tipo_cliente = tipo.target.value;
        console.log(this.formCliente);

        if (tipo_cliente == 'AF_CUETO_S') {
          this.tipo='Afiliado Cueto Independiente';
          this.formCliente.tipo='AF_CUETO_S';
        }
        if (tipo_cliente == 'AF_CUETO') {
          this.tipo='Afiliado Cueto con grupo Familiar';
          this.formCliente.tipo='AF_CUETO';
        }  
    }

    public resetCliente(){
      //this.registroClienteForm.reset();
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

    public chekarMoroso(esMoroso) {
          console.log(esMoroso);
         if (esMoroso==true) {
           this.formCliente.estado='M';
         }else{
           this.formCliente.estado='';
         }
    }
    public esMoroso(esTrue) {
      console.log(esTrue);
      if(esTrue==false){
        this.moroso=true;
        this.formCliente.estado='M';
      }else{
        // this.moroso=false;
        // this.formCliente.estado='';
      }
    }


    public actual(fecha) {
        var fmoroso = new Date(fecha).getTime();
        var falta = new Date(this.formCliente.f_alta).getTime();
        console.log(falta);
        if (falta>fmoroso) {
          alert('Esta fecha debe ser mayor que la fecha de alta o última renovación');
        }else{
           var diaActual = new Date(fecha);
           var mesActual = diaActual.getMonth();
           var anoActual = diaActual.getFullYear();
           mesActual=mesActual+1;
           this.mes=mesActual;
           this.ano=anoActual;
           console.log(mesActual);
           console.log(anoActual);
           this.ano=anoActual;
           if (true) {
                   if (mesActual==1) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= false;
                       this.formCliente.cuotas[0].Marzo= false;
                       this.formCliente.cuotas[0].Abril= false;
                       this.formCliente.cuotas[0].Mayo= false;
                       this.formCliente.cuotas[0].Junio= false;
                       this.formCliente.cuotas[0].Julio= false;
                       this.formCliente.cuotas[0].Agosto= false;
                       this.formCliente.cuotas[0].Septiembre= false;
                       this.formCliente.cuotas[0].Octubre= false;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                   }
                   if (mesActual==2) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= false;
                       this.formCliente.cuotas[0].Abril= false;
                       this.formCliente.cuotas[0].Mayo= false;
                       this.formCliente.cuotas[0].Junio= false;
                       this.formCliente.cuotas[0].Julio= false;
                       this.formCliente.cuotas[0].Agosto= false;
                       this.formCliente.cuotas[0].Septiembre= false;
                       this.formCliente.cuotas[0].Octubre= false;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                       
                   }
                   if (mesActual==3) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= false;
                       this.formCliente.cuotas[0].Mayo= false;
                       this.formCliente.cuotas[0].Junio= false;
                       this.formCliente.cuotas[0].Julio= false;
                       this.formCliente.cuotas[0].Agosto= false;
                       this.formCliente.cuotas[0].Septiembre= false;
                       this.formCliente.cuotas[0].Octubre= false;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                       
                   }
                   if (mesActual==4) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= true;
                       this.formCliente.cuotas[0].Mayo= false;
                       this.formCliente.cuotas[0].Junio= false;
                       this.formCliente.cuotas[0].Julio= false;
                       this.formCliente.cuotas[0].Agosto= false;
                       this.formCliente.cuotas[0].Septiembre= false;
                       this.formCliente.cuotas[0].Octubre= false;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                       
                   }
                   if (mesActual==5) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= true;
                       this.formCliente.cuotas[0].Mayo= true;
                       this.formCliente.cuotas[0].Junio= false;
                       this.formCliente.cuotas[0].Julio= false;
                       this.formCliente.cuotas[0].Agosto= false;
                       this.formCliente.cuotas[0].Septiembre= false;
                       this.formCliente.cuotas[0].Octubre= false;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                       
                   }
                   if (mesActual==6) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= true;
                       this.formCliente.cuotas[0].Mayo= true;
                       this.formCliente.cuotas[0].Junio= true;
                       this.formCliente.cuotas[0].Julio= false;
                       this.formCliente.cuotas[0].Agosto= false;
                       this.formCliente.cuotas[0].Septiembre= false;
                       this.formCliente.cuotas[0].Octubre= false;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                       
                   }
                   if (mesActual==7) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= true;
                       this.formCliente.cuotas[0].Mayo= true;
                       this.formCliente.cuotas[0].Junio= true;
                       this.formCliente.cuotas[0].Julio= true;
                       this.formCliente.cuotas[0].Agosto= false;
                       this.formCliente.cuotas[0].Septiembre= false;
                       this.formCliente.cuotas[0].Octubre= false;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                       
                   }
                   if (mesActual==8) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= true;
                       this.formCliente.cuotas[0].Mayo= true;
                       this.formCliente.cuotas[0].Junio= true;
                       this.formCliente.cuotas[0].Julio= true;
                       this.formCliente.cuotas[0].Agosto= true;
                       this.formCliente.cuotas[0].Septiembre= false;
                       this.formCliente.cuotas[0].Octubre= false;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                       
                   }
                   if (mesActual==9) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= true;
                       this.formCliente.cuotas[0].Mayo= true;
                       this.formCliente.cuotas[0].Junio= true;
                       this.formCliente.cuotas[0].Julio= true;
                       this.formCliente.cuotas[0].Agosto= true;
                       this.formCliente.cuotas[0].Septiembre= true;
                       this.formCliente.cuotas[0].Octubre= false;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                       
                   }
                   if (mesActual==10) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= true;
                       this.formCliente.cuotas[0].Mayo= true;
                       this.formCliente.cuotas[0].Junio= true;
                       this.formCliente.cuotas[0].Julio= true;
                       this.formCliente.cuotas[0].Agosto= true;
                       this.formCliente.cuotas[0].Septiembre= true;
                       this.formCliente.cuotas[0].Octubre= true;
                       this.formCliente.cuotas[0].Noviembre= false;
                       this.formCliente.cuotas[0].Diciembre= false;
                       
                   }
                   if (mesActual==11) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= true;
                       this.formCliente.cuotas[0].Mayo= true;
                       this.formCliente.cuotas[0].Junio= true;
                       this.formCliente.cuotas[0].Julio= true;
                       this.formCliente.cuotas[0].Agosto= true;
                       this.formCliente.cuotas[0].Septiembre= true;
                       this.formCliente.cuotas[0].Octubre= true;
                       this.formCliente.cuotas[0].Noviembre= true;
                       this.formCliente.cuotas[0].Diciembre= false;
                   }
                   if (mesActual==12) {
                       this.formCliente.cuotas[0].Enero=true;
                       this.formCliente.cuotas[0].Febrero= true;
                       this.formCliente.cuotas[0].Marzo= true;
                       this.formCliente.cuotas[0].Abril= true;
                       this.formCliente.cuotas[0].Mayo= true;
                       this.formCliente.cuotas[0].Junio= true;
                       this.formCliente.cuotas[0].Julio= true;
                       this.formCliente.cuotas[0].Agosto= true;
                       this.formCliente.cuotas[0].Septiembre= true;
                       this.formCliente.cuotas[0].Octubre= true;
                       this.formCliente.cuotas[0].Noviembre= true;
                       this.formCliente.cuotas[0].Diciembre= true;
                   }           
                }
        }
    }
    public chekar() {

       // var diaActual = new Date();
       // var mesActual = diaActual.getMonth();
       // var anoActual = diaActual.getFullYear();
       // this.ano=anoActual;
       // console.log(anoActual);

    }

}
