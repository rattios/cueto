import { Injectable } from '@angular/core';

@Injectable()
export class RutaService {

  public ruta_servidor="http://vivomedia.com.ar/cuetociasrl/cuetoAPI/";

  constructor() { }

  get_ruta(){
  	return this.ruta_servidor;
  }

}
