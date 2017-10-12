<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    //return view('welcome');

//-------------------------------
    //Prueba de relacion de TecMarcaExtintor con TecExtintor
    //$tecextintores = \App\TecMarcaExtintor::find(4)->tecextintores()->where('serie', '=', '101953')->first();
    //$tecextintores = \App\TecMarcaExtintor::find(4)->tecextintores;
    //echo $tecextintores;

    //Prueba de relacion inversa
    //$tecmarcaextintor = \App\TecExtintor::find(10001)->tecmarcaextintor;
    //echo $tecmarcaextintor;

//-------------------------------
    //Prueba de Relación de TecUbicacion con TecExtintor
    //$tecextintores = \App\TecUbicacion::find(4)->tecextintores;
    //echo $tecextintores;

    //Prueba de relacion inversa
    //$tecubicacion = \App\TecExtintor::find(10001)->tecubicacion;
    //echo $tecubicacion;

//-------------------------------
    //Prueba de Relación de TecTipoExtintor con TecExtintor
    //$tecextintores = \App\TecTipoExtintor::find(4)->tecextintores;
    //echo $tecextintores;

    //Prueba de relacion inversa
    //$tectipoextintor = \App\TecExtintor::find(10001)->tectipoextintor;
    //echo $tectipoextintor;

//-------------------------------
    //Prueba de Relación de TecCapExtintor con TecExtintor
    //$tecextintores = \App\TecCapExtintor::find(1)->tecextintores;
    //echo $tecextintores;

    //Prueba de relacion inversa
    //$teccapextintor = \App\TecExtintor::find(10001)->teccapextintor;
    //echo $teccapextintor;

//-------------------------------
    //Prueba de Relación de TecLocalidad con TecExtintor
    //$tecextintores = \App\TecLocalidad::find(5)->tecextintores;
    //echo $tecextintores;

    //Prueba de relacion inversa
    //$teclocalidad = \App\TecExtintor::find(10001)->teclocalidad;
    //echo $teclocalidad;

//-------------------------------
    //Prueba de Relación de TecEmpresa con TecExtintor
    //$tecextintores = \App\TecEmpresa::find(5)->tecextintores;
    //echo $tecextintores;

    //Prueba de relacion inversa
    //$tecempresa = \App\TecExtintor::find(10001)->tecempresa;
    //echo $tecempresa;

//-------------------------------
    //Prueba de Relación de TecYacimiento con TecExtintor
    //$tecextintores = \App\TecYacimiento::find(5)->tecextintores;
    //echo $tecextintores;

    //Prueba de relacion inversa
    //$tecyacimiento = \App\TecExtintor::find(10001)->tecyacimiento;
    //echo $tecyacimiento;

//-------------------------------
    //Prueba de Relación de TecExtintor con InspInspeccion
    //$inspinspecciones = \App\TecExtintor::find(10009)->inspinspecciones;
    //echo $inspinspecciones;

    //Prueba de relacion inversa
    //$tecextintor = \App\InspInspeccion::find(1)->tecextintor;
    //echo $tecextintor;

        //Nota ->Esta prueba no pasa xq la tabla insp_innspecciones
                //actualmente esta vacia
            

//-------------------------------
    //Prueba de Relación de TecEmpresa con TecYacimiento
    //$tecyacimientos = \App\TecEmpresa::find(1)->tecyacimientos;
    //echo $tecyacimientos;

    //echo "<br><br>";

    //$auxyacimientos = \App\TecEmpresa::find(1)->auxyacimientos;
    //echo $auxyacimientos;

    //echo "<br><br>";

    //Prueba de relacion inversa
    //$tecempresas = \App\TecYacimiento::find(1)->tecempresas;
    //echo $tecempresas;

    //echo "<br><br>";

    //$auxempresas = \App\TecYacimiento::find(1)->auxempresas;
    //echo $auxempresas;

//-------------------------------
    //Prueba de Relación de TecEmpresa con TecOt
    //$tecot = \App\TecEmpresa::find(1)->tecot;
    //echo $tecot;

    //Prueba de relacion inversa
    //$tecempresa = \App\TecOt::find(1)->tecempresa;
    //echo $tecempresa;

//-------------------------------
    //Prueba de Relación de TecEmpresa con TecLocalidad
    //$auxlocalidades = \App\TecEmpresa::find(1)->auxlocalidades;
    //echo $auxlocalidades;

    //Prueba de relacion inversa
    //$auxempresas = \App\TecLocalidad::find(2)->auxempresas;
    //echo $auxempresas;

//-------------------------------
    //Prueba de Relación de TecExtintor con TecOTExtintor
    //$auxotextintores = \App\TecExtintor::find(10001)->auxotextintores;
    //echo $auxotextintores;

    //Prueba de relacion inversa
    //$auxextintores = \App\TecOTExtintor::find(1)->auxextintores;
    //echo $auxextintores;

//-------------------------------
    //Prueba de Relación de InspInspeccion con InspDetalleInspeccion
    //$inspdetalleinspeccion = \App\InspInspeccion::find(1)->inspdetalleinspeccion;
    //echo $inspdetalleinspeccion;

    //Prueba de relacion inversa
    //$inspinspeccion = \App\InspDetalleInspeccion::find(1)->inspinspeccion;
    //echo $inspinspeccion;

//-------------------------------
    //Prueba de Relación de TecExtintor con ViewExtUltMov
    //$viewextultmov = \App\TecExtintor::find(10001)->viewextultmov;
    //echo $viewextultmov;

    //Prueba de relacion inversa
    //$tecextintor = \App\ViewExtUltMov::find(10001)->tecextintor;
    //echo $tecextintor;

//-------------------------------
    //Prueba de Relación de InspDetalleInspeccion con InspInspeccion
    //$inspdetalleinspeccion = \App\InspInspeccion::find(1)->inspdetalleinspeccion;
    //echo $inspdetalleinspeccion;

    //Prueba de relacion inversa
    //$inspinspeccion = \App\InspDetalleInspeccion::find(1)->inspinspeccion;
    //echo $inspinspeccion;

    //Nota ->Esta prueba no pasa xq las tablas actualmente 
            //estan vacias

//-------------------------------
    //Prueba de Relación de ViewExtUltMov con InspInspeccion:
    //$inspeccion = \App\ViewExtUltMov::find(10083)->inspeccion;
    //echo $inspeccion;

    //Prueba de relacion inversa
    //$viewextultmov = \App\InspInspeccion::find(1)->viewextultmov;
    //echo $viewextultmov;

    /*$inspinspecciones = \App\InspInspeccion::
    with('tecextintor.teclocalidad.auxempresas')
    ->where('insp_estado', '=', 'P')
    ->find(1);*/
    //->get();

    //dd($inspinspecciones->toJson());
    //dd($inspinspecciones->toArray());

    //$tecuserinsp = \App\Tec_user::find(1)->tecuserinsp;
    //echo $tecuserinsp;


//--------------------------------------------------------
    //Pruebas relaciones 24 manger

    //Prueba de Relación de subcat con cat
    //$subcat = \App\Categoria::find(1)->subcategorias;
    //echo $subcat;

    //cargar una cat con sus subcat
    //$cat = App\Categoria::find(1)->with('subcategorias')->first();
    //echo $cat;

    //cargar todas las cat con sus subcat
    //$cat = App\Categoria::with('subcategorias')->get();
    //echo $cat;

    //$subcat = App\Categoria::find(1)->subcategorias()->get();
    //echo $subcat;

    //$cat = App\Categoria::find(3)->with('subcategorias')->get();
    //echo $cat;

    
});

Route::group(  ['middleware' =>'cors'], function(){

    //----Pruebas DocumentacionController
    //Route::get('/documentacion','DocumentacionController@index');

    //----Pruebas LoginController
    Route::post('/login/web','LoginController@loginWeb');

        //----Pruebas UsuarioController
        Route::get('/usuarios','UsuarioController@index');
        Route::get('/usuarios/vendedores','UsuarioController@vendedores');
        Route::get('/usuarios/vendedores/cartera','UsuarioController@vendedoresCartera');
        Route::post('/usuarios','UsuarioController@store');
        Route::put('/usuarios/{id}','UsuarioController@update');
        Route::delete('/usuarios/{id}','UsuarioController@destroy');
        Route::get('/usuarios/{id}','UsuarioController@show');

        
        //----Pruebas SucursalController
        Route::get('/sucursales','SucursalController@index');
        Route::get('/sucursales/informacion','SucursalController@sucursalesInformacion');
        Route::post('/sucursales','SucursalController@store');
        Route::put('/sucursales/{id}','SucursalController@update');
        Route::delete('/sucursales/{id}','SucursalController@destroy');
        Route::get('/sucursales/{id}','SucursalController@show');
        Route::get('/sucursales/{id}/informacion','SucursalController@sucursalInformacion');
        Route::get('/sucursales/{id}/usuarios','SucursalController@sucursalUsuarios');
        Route::get('/sucursales/{id}/clientes','SucursalController@sucursalClientes');

        //----Pruebas CarteraController
        Route::get('/carteras','CarteraController@index');
        //Route::get('/carteras/sucursal/{sucursal_id}','CarteraController@carterasSucursal');
        Route::post('/carteras','CarteraController@store');
        Route::put('/carteras/{id}','CarteraController@update');
        Route::delete('/carteras/{id}','CarteraController@destroy');
        Route::get('/carteras/{id}','CarteraController@show');
        Route::get('/carteras/{id}/clientes','CarteraController@carteraClientes');

        //----Pruebas ClienteController
        Route::get('/clientes','ClienteController@index');
        //Route::get('/clientes/afiliados_cueto/familiares','ClienteController@afs_cuetoFamiliares');
        //Route::get('/clientes/afiliados_convenio/empleados','ClienteController@afs_convenioEmpledos');
        Route::post('/clientes','ClienteController@store');
        Route::put('/clientes/{id}','ClienteController@update');
        Route::delete('/clientes/{id}','ClienteController@destroy');
        Route::get('/clientes/{id}','ClienteController@show');

        //----Pruebas FamiliarController
        Route::get('/familiares','FamiliarController@index');
        Route::post('/familiares','FamiliarController@store');
        Route::put('/familiares/{id}','FamiliarController@update');
        Route::delete('/familiares/{id}','FamiliarController@destroy');
        Route::get('/familiares/{id}','FamiliarController@show');

        //----Pruebas EmpleadoController
        Route::get('/empleados','EmpleadoController@index');
        Route::post('/empleados','EmpleadoController@store');
        Route::put('/empleados/{id}','EmpleadoController@update');
        Route::delete('/empleados/{id}','EmpleadoController@destroy');
        Route::get('/empleados/{id}','EmpleadoController@show');

        //----Pruebas ConvenioController
        Route::get('/convenios','ConvenioController@index');
        Route::post('/convenios','ConvenioController@store');
        Route::put('/convenios/{id}','ConvenioController@update');
        //Route::delete('/convenios/{id}','ConvenioController@destroy');
        Route::get('/convenios/{id}','ConvenioController@show');

        
    

    Route::group(['middleware' => 'jwt-auth'], function(){


    });
});
