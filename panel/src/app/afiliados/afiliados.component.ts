import { Component, OnInit, HostListener, NgZone, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl} from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { RutaService } from '../services/ruta.service';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { Observable, Observer } from 'rxjs';

declare var google: any;
declare const $: any;

@Component({
  selector: 'app-afiliados',
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.css']
})
export class AfiliadosComponent implements OnInit {

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
  private data:any;
  //private data:any;
  public data2:any;
  public socios:any;
  public productList:any;
  public loading=false;
  public loadingSucursales=false;
  public loadingAfiliados=false;
  public ver=true;
  public verDatos=false;
  public verEditar=false;
  public user_id = localStorage.getItem("manappger_user_id");
  public registroClienteForm: FormGroup;
  public sucursal:any;
  public carteras:any;
  public ticket:any;
  public fechaSistema:any;
  public recibosD:any;
  public recibosA:any;
  public imagen:any;
  private zone: NgZone;
  public progress: number = 0;
  zoom: number = 16;
  public searchControl: FormControl;
  public latitude: number=0;
  public longitude: number=0;
  public formCliente = {
            tipo: "",
            nombre_1: "",
            nombre_2: "",
            apellido_1: "",
            apellido_2: "",
            dni: "",
            direccion: "",
            lat:0,
            lng:0,
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

    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(private http: HttpClient, private builder: FormBuilder, private ruta: RutaService,private ngZone: NgZone, private mapsAPILoader: MapsAPILoader) {
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
            f_pago:["", Validators.required],
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
      this.loadingSucursales=true;
      this.loadingAfiliados=true;
      this.zone = new NgZone({ enableLongStackTrace: false });
      this.http.get(this.ruta.get_ruta()+'public/sucursales/'+localStorage.getItem("manappger_user_sucursal_id")+'/carteras')
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
               this.loadingSucursales=false;
               this.checkLoading();
            },
           msg => { // Error
             console.log(msg.error.error);
             alert('error:'+msg.error);
           });
      this.http.get(this.ruta.get_ruta()+'public/clientes/familiares?sucursal_id='+localStorage.getItem('manappger_user_sucursal_id'))
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             this.data2 = data;
             this.socios=data;
             this.socios=this.socios.clientes;
             this.recibosD=[];
             this.recibosA=[];
             for (var i = 0; i < this.socios.length; i++) {
               for (var j = 0; j < this.socios[i].recibos.length; j++) {
                 this.socios[i].recibosD=[];
                 this.socios[i].recibosA=[];
                }
             }
             for (var i = 0; i < this.socios.length; i++) {
               for (var j = 0; j < this.socios[i].recibos.length; j++) {
                 if(this.socios[i].recibos[j].estado=='D') {
                    this.socios[i].recibosD.push(this.socios[i].recibos[j]);
                 }else if(this.socios[i].recibos[j].estado=='A') {
                    this.socios[i].recibosA.push(this.socios[i].recibos[j]);
                 }
                }
             }
             this.data=this.socios;
             console.log(this.socios);
             console.log(this.recibosD);
             console.log(this.recibosA);
             
             this.productList = this.data;
             this.filteredItems = this.productList;
             console.log(this.productList);
             this.productList.sort((function(a,b) {return (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0);} ));


             for (var i = 0; i < this.productList.length; ++i) {

               this.productList[i].nFamiliares=this.productList[i].familiares.length;

               if (this.productList[i].tipo=='AF_CUETO') {
                 this.productList[i].tipo2='GFS';
               }else if (this.productList[i].tipo=='AF_CUETO_S') {
                 this.productList[i].tipo2='SSF';
               }
               if (this.productList[i].estado=='M') {
                 this.productList[i].estado2='MOROSO';
               }else if (this.productList[i].estado=='V') {
                 this.productList[i].estado2='VIGENTE';
               }else if (this.productList[i].estado=='B') {
                 this.productList[i].estado2='BAJA';
               }else if (this.productList[i].estado=='PC') {
                 this.productList[i].estado2='PRE CARGADA';
               }else if (this.productList[i].estado=='P') {
                 this.productList[i].estado2='PENDIENTE POR AUTORIZACION';
               }

               if(this.productList[i].user_id==1) {
                 this.productList[i].user_id2='Araceli';
               }else if (this.productList[i].user_id=='2') {
                 this.productList[i].user_id2='Natalia';
               }

                this.productList[i].ticket=this.productList[i].ticket.toString();
             }

             this.init();
             
             this.loadingAfiliados=false;
             this.checkLoading();
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
             alert('error:'+msg.error);
           });
    }
    public setDir(dir){
    return Observable.create(observer => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'location': dir}, function(results, status) {
            if (status === 'OK') {
              if (results[1]) {
                console.log(results[1]);
                 observer.next(results[1].formatted_address);
                 observer.complete();
                
              } else {
                alert('No results found');
                observer.next({});
                observer.complete();
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
              observer.next({});
              observer.complete();
            }
          });
       })
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    var latlng:any;
    
    latlng=$event;
    latlng=latlng.coords;
    this.registroClienteForm.patchValue({lat: latlng.lat });
    this.registroClienteForm.patchValue({lng: latlng.lng });

    this.setDir(latlng).subscribe(result => {
      this.registroClienteForm.patchValue({direccion: result });
      },error => console.log(error),() => console.log('Geocoding completed!')
    );
    
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }


    compare(a,b) {
      if (a.id < b.id)
        return -1;
      if (a.id > b.id)
        return 1;
      return 0;
    }

    checkLoading(){
      if (this.loadingAfiliados==false && this.loadingSucursales==false) {
        this.loading=false;
      }  
    }

    checkDNI(dni){
      console.log(dni);
      if(dni=='') {
        // code...
      }else{
        this.http.get(this.ruta.get_ruta()+'public/dni/'+dni)
         .toPromise()
         .then(
           data => { // Success
             console.log(data);
             var cliente:any;
             cliente=data;
             this.showNotification('top','center','Este DNI ya pertenece a: ' + JSON.stringify(cliente.cliente[0].nombre_1),4);
           },
           msg => { // Error
             console.log(msg);
           }
        );
      }
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
        this.imagen=item.imagenes;
          var lat=parseFloat(item.lat);
          var lng=parseFloat(item.lng);
          console.log(this.formCliente.lat);
          
          
          this.formCliente.lat=lat;
          this.formCliente.lng=lng;

        console.log(item);
    }
    editar(item){

        //create search FormControl
      this.searchControl = new FormControl();
      //load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
        var defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(-38.512445, -70.482788),
          new google.maps.LatLng(-37.673767, -67.692261),
          new google.maps.LatLng(-38.778443, -62.616577),
          new google.maps.LatLng(-40.009472, -68.076782)
        );
        var options = { 
          bounds: defaultBounds,
          //componentRestrictions: {country: "AR"}
          //types: ['(cities)'],
          //componentRestrictions: {country: 'fr'}
        };
        setTimeout(()=>{

          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"]
          }, options);

          var circle = new google.maps.Circle({
            center: {lat:  -38.938771, lng: -67.995493},
            radius: 10*1000
          });
          autocomplete.setBounds(circle.getBounds());
          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              let place = autocomplete.getPlace();
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
              console.log(place.formatted_address);
              this.registroClienteForm.patchValue({direccion: place.formatted_address });
              //console.log(place.address_components[0].long_name);
              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.registroClienteForm.patchValue({lat: place.geometry.location.lat() });
              this.longitude = place.geometry.location.lng();
              this.registroClienteForm.patchValue({lng: place.geometry.location.lng() });
              this.zoom = 11;
              console.log(place.geometry.location.lat());
            });
          });
        },1000);
      });

        this.ver=false;
        this.verEditar=true; 
        console.log(item);
        setTimeout(()=>{
          this.latitude= parseFloat(item.lat);
          this.longitude= parseFloat(item.lng);
          console.log('item');
        },1500)
        this.imagen=item.imagenes;

        if (item.f_nacimiento=='0000-00-00'||item.f_nacimiento==null) {
          item.f_nacimiento="";
        }
        if (item.f_alta=='0000-00-00'||item.f_alta==null) {
          item.f_alta="";
        }
        if (item.f_pago=='0000-00-00'||item.f_pago==null) {
          item.f_pago="";
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
            lat: [0],
            lng: [0],
            f_nacimiento: [""],
            estado: [""],
            sexo: [""],
            cuota: [""],
            correo: [""],
            telefono: [""],
            f_alta: [""],
            f_pago:[""],
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
        this.registroClienteForm.patchValue({lat: parseFloat(item.lat) });
        this.registroClienteForm.patchValue({lng: parseFloat(item.lng) });
        this.registroClienteForm.patchValue({f_nacimiento: item.f_nacimiento });
        this.registroClienteForm.patchValue({estado: item.estado });
        this.registroClienteForm.patchValue({sexo: item.sexo });
        this.registroClienteForm.patchValue({cuota: item.cuota });
        this.registroClienteForm.patchValue({correo: item.correo });
        this.registroClienteForm.patchValue({telefono: item.telefono });
        this.registroClienteForm.patchValue({f_alta: item.f_alta });
        this.registroClienteForm.patchValue({f_pago: this.siPago(item.pagos) });
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
        this.registroClienteForm.patchValue({mes: new Date(this.siPago(item.pagos)).getMonth()+1 });
        this.registroClienteForm.patchValue({anio: new Date(this.siPago(item.pagos)).getFullYear() });

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

    siPago(pago){
      console.log(pago);
      if(pago.length>0) {
        return pago[0].f_pago;
      }else{
        return '';
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
             for (var i = 0; i < this.socios.length; i++) {

               if (this.socios[i].f_moroso=='0000-00-00'||this.socios[i].f_moroso==null) {
                 this.socios[i].f_moroso='';
               }

             }
             this.data=this.socios;
             console.log(this.socios);
             
             

             this.productList = this.data;
             this.filteredItems = this.productList;
             console.log(this.productList);
             this.productList.sort((function(a,b) {return (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0);} ));


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
             this.volver();
           },
           msg => { // Error
             console.log(msg);
             this.showNotification('top','center','Ha ocurrido un error' + JSON.stringify(msg.error),4);
             this.loading=false;
             this.volver();
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
             this.volver();
           },
           msg => { // Error
             console.log(msg);
             this.showNotification('top','center','Ha ocurrido un error' + JSON.stringify(msg.error),4);
             this.loading=false;
             this.volver();
           }
         );
    }


    uppercase(value: string) {
      return value.toUpperCase();
    }

    public loading2: boolean = true;
    public loading3: boolean = false;
    onLoad() {
        this.loading2 = false;
    }

    uploadFile: any;
    hasBaseDropZoneOver: boolean = false;
    options: Object = {
      url: 'http://vivomedia.com.ar/cuetociasrl/upload.php',
      calculateSpeed: true
    };
    sizeLimit = 2000000;
    handleUpload(data): void {
      
      if (data && data.response) {
        data = JSON.parse(data.response);
        this.uploadFile = data;
        this.loading=false;
        this.registroClienteForm.patchValue({imagenes: 'http://vivomedia.com.ar/cuetociasrl/uploads/'+this.uploadFile.generatedName });
        this.imagen='http://vivomedia.com.ar/cuetociasrl/uploads/'+this.uploadFile.generatedName;
        this.progress=0;
        this.loading2 = true;
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

    volver(){
        this.ver=true;
        this.verDatos=false;
        this.verEditar=false;
    }
    public banderaCheck=1;
    public estadoMoroso='No';

    public compFechPago(){
      setTimeout(()=>{
        console.log(this.registroClienteForm.value.f_pago);
        console.log(this.registroClienteForm.value.f_alta);
        var fpago= new Date(this.registroClienteForm.value.f_pago);
        var falta= new Date(this.registroClienteForm.value.f_alta);

        console.log(fpago.getTime());
        console.log(falta.getTime());

        if(fpago.getTime()<falta.getTime()){
          alert('La fecha de pago no puede ser menor que la de alta.');
        }else{
          //alert('si sirve');
        }
      },500)
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
                       
                }
            }else{
                if (esMoroso==true) {
                    this.registroClienteForm.patchValue({estado: 'M' });
                    //this.chekar();
                    this.estadoMoroso='Si';
                }else{
                    this.registroClienteForm.patchValue({estado: '' });
                    this.estadoMoroso='No';
                     
                }
                
            }
        }, 500); 

       
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

     public verEstado() {
      
    }

    public setMesAnio() {
      setTimeout(() => {
        
        const control = this.registroClienteForm.controls;
        var f_pago=new Date(control.f_pago.value);
        this.registroClienteForm.patchValue({mes: f_pago.getMonth()+1 });
        this.registroClienteForm.patchValue({anio: f_pago.getFullYear() });
        
        console.log(this.registroClienteForm.value);
      }, 500);
    }



   // -------------------------------------------------------------------------------------------------------------------
   filteredItems : any;
   pages : number = 4;
   pageSize : number = 10;
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
              console.log(this.productList[i]);

              if(this.productList[i].estado2="") {
                this.productList[i].estado2=" ";
              }

              if (this.productList[i].dni.indexOf(this.inputName)>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].ticket.indexOf(this.inputName)>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].f_alta.indexOf(this.inputName)>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].nombre_1.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].apellido_1.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              
              }else if (this.productList[i].estado2.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].tipo2.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
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
