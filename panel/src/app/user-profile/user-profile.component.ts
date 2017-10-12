import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { Clientes  } from './clientes.interface';

declare const $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

    public data: any;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "nombre";
    public sortOrder = "asc";
    public usuarios:any;
    public registroClienteForm: FormGroup;
    public clientesAdd:any;

    constructor(private http: HttpClient, private builder: FormBuilder) {
        this.registroClienteForm = this.builder.group({
            tipo: ['AF_CUETO', Validators.required],
            nombre_1: ['123', Validators.required],
            nombre_2: ['123'],
            apellido_1: ['123', Validators.required],
            apellido_2: ['123'],
            dni: ['123', Validators.required],
            direccion: ['123', Validators.required],
            f_nacimiento: ['2017-09-07', Validators.required],
            estado: ['123', Validators.required],
            sexo: ['123', Validators.required],
            cuota: ['123'],
            sucursal_id: ['1', Validators.required],
            cartera_id: ['1', Validators.required],
            familiares: this.builder.array([this.familiaresArray()])
        })
    }

    familiaresArray(){
        return this.builder.group({
            nombre_1: ['123', Validators.required],
            nombre_2: ['123'],
            apellido_1: ['123', Validators.required],
            apellido_2: ['132'],
            dni: ['123', Validators.required],
            direccion: ['123', Validators.required],
            f_nacimiento: ['2017-09-07', Validators.required],
            sexo: ['123', Validators.required],
            vinculo: ['123', Validators.required],
            observaciones: ['123']
            })
    }


    ngOnInit(): void {
      /*this.http.get('http://rattios.com/24managerAPI/public/usuarios')
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.data = data;
             this.usuarios=data;
             this.data=this.usuarios.usuarios;
             console.log(this.usuarios);

           },
           msg => { // Error
             console.log(msg.error.error);

           }
         );*/
    }

    enviarCliente(model: Clientes){
        this.clientesAdd=model;
        console.log(this.clientesAdd.value);
        var send=this.clientesAdd.value;
        send.familiares=JSON.stringify(send.familiares);
        this.http.post('http://vivomedia.com.ar/cuetociasrl/cuetoAPI/public/clientes',send)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             alert('exito');
             
           },
           msg => { // Error
             console.log(msg);
             alert('error');
             
           }
         );
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

    update_tipo(tipo){
        var tipo_cliente = tipo.target.value;
        if (tipo_cliente == 'AF_CUETO_S') {
            this.registroClienteForm.removeControl('familiares');
        }
        if (tipo_cliente == 'AF_CUETO') {
            this.registroClienteForm.addControl('familiares', this.builder.array([this.familiaresArray()]));
        }  
    }

    public getSocios(){
      
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

}