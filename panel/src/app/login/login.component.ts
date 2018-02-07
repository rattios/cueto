import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { RutaService } from '../services/ruta.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public people:any;
  user= ''
  password='';
  public token:any;
  public loading=false;

  constructor(private http: HttpClient,private router: Router, private ruta: RutaService) {

  }

  ngOnInit() {
  }


  Ingresar(){

  	//localStorage.setItem('manappger', this.token);
    this.loading=true;
  	this.people='esperando...';
   
    var datos= {
    	user: this.user,
    	password: this.password
    }

    

      this.http.post(this.ruta.get_ruta()+'public/login/web', datos)
        .toPromise()
        .then(
          data => { // Success
            console.log(data);
            this.token=data;
            localStorage.setItem('manappger_token', this.token.token);
            console.log(this.token.user.id);
            localStorage.setItem('manappger_user_id', this.token.user.id);
            localStorage.setItem('manappger_user_nombre', this.token.user.nombre);
            localStorage.setItem('manappger_user_sucursal_id', this.token.user.sucursal_id);
            this.people='exito...';
            this.router.navigate(['/Clientes']);
            this.loading=false;
         },
          msg => { // Error
          	console.log(msg);
          	//this.people=msg.error.error;
            this.loading=false;

          }
        );
  }

}
