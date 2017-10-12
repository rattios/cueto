export class Clientes{
	tipo: string;
	nombre_1: string;
	nombre_2: string;
	apellido_1: string;
	apellido_2: string;
	dni: string;
	direccion: string;
	f_nacimiento: any;
	estado: string;
	sexo: string;
	cuota: number;
	sucursal_id: number;
	cartera_id: number;
	familiares: Familiares[];
}

export class Familiares{
	nombre_1: string;
	nombre_2: string;
	apellido_1: string;
	apellido_2: string;
	dni: string;
	direccion: string;
	f_nacimiento: any;
	sexo: string;
	vinculo: string;
	observaciones: string;
	sucursal_id: number;
	cliente_id: number;
}