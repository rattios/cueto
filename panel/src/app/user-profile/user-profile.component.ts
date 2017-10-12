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

    constructor(private http: HttpClient, private builder: FormBuilder) {
        this.registroClienteForm = this.builder.group({
            tipo: ['', Validators.required],
            nombre_1: ['', Validators.required],
            nombre_2: ['', Validators.required],
            apellido_1: ['', Validators.required],
            apellido_2: ['', Validators.required],
            dni: ['', Validators.required],
            direccion: ['', Validators.required],
            f_nacimiento: ['', Validators.required],
            estado: ['', Validators.required],
            sexo: ['', Validators.required],
            cuota: ['', Validators.required],
            sucursal_id: ['', Validators.required],
            cartera_id: ['', Validators.required],
            familiares: this.builder.array([this.familiaresArray()])
        })
    }

    familiaresArray(){
        return this.builder.group({
            nombre_1: ['', Validators.required],
            nombre_2: ['', Validators.required],
            apellido_1: ['', Validators.required],
            apellido_2: ['', Validators.required],
            dni: ['', Validators.required],
            direccion: ['', Validators.required],
            f_nacimiento: ['', Validators.required],
            sexo: ['', Validators.required],
            vinculo: ['', Validators.required],
            observaciones: ['', Validators.required],
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
        var clientes=model;
        console.log(clientes);

        this.http.post('http://vivomedia.com.ar/cuetociasrl/cuetoAPI/public/clientes',clientes)
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
            alert('completa los ');
        }else{
            control.push(this.familiaresArray());
        }
    }
    remover(i){
        const control= <FormArray>this.registroClienteForm.controls["familiares"];
        var index=control.value.length-1;
        control.removeAt(index);
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
