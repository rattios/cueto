import { Injectable } from '@angular/core';

@Injectable()
export class RutaService {

  //public ruta_servidor="http://vivomedia.com.ar/cuetociasrl/cuetoAPI/";
  public ruta_servidor="http://localhost/cueto/cuetoAPI/"; //Local stalin
  //public ruta_servidor="http://localhost/gitHub/cueto/cuetoAPI/"; //Local Freddy

  constructor() { }

  get_ruta(){
  	return this.ruta_servidor;
  }

}
