<?php



Route::get('/', function () {


    
});

Route::group(  ['middleware' =>'cors'], function(){

    //----Pruebas DocumentacionController
    //Route::get('/documentacion','DocumentacionController@index');

    //----Pruebas LoginController
        Route::get('/getHour', 'ClienteController@getHour');
        Route::post('/login/web','LoginController@loginWeb');

        //----Pruebas UsuarioController
        Route::get('/usuarios','UsuarioController@index');
        //Route::get('/usuarios/vendedores','UsuarioController@vendedores');
        //Route::get('/usuarios/vendedores/cartera','UsuarioController@vendedoresCartera');
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
        Route::get('/sucursales/{id}/carteras','SucursalController@sucursalCarteras');

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
        Route::get('/clientes/familiares','ClienteController@indexFamiliares');
        //Route::get('/clientes/afiliados_cueto/familiares','ClienteController@afs_cuetoFamiliares');
        //Route::get('/clientes/afiliados_convenio/empleados','ClienteController@afs_convenioEmpledos');
        //Route::post('/clientes','ClienteController@store');
        Route::post('/clientes','ClienteController@storeClientes');
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

        Route::get('/tarifas','TarifaCuetoController@indexTarifas');
        //----Pruebas TarifasCuetoController
        Route::get('/tarifas_familiar','TarifaCuetoController@index');
        Route::post('/tarifas_familiar/store','TarifaCuetoController@store');
        Route::put('/tarifas_familiar/{id}','TarifaCuetoController@update');
        Route::delete('/tarifas_familiar/{id}','TarifaCuetoController@destroy');
        Route::get('/tarifas_familiar/{id}','TarifaCuetoController@show');

        //----Pruebas TarifasCuetoSolaController
        Route::get('/tarifas_solo','TarifaCuetoSolaController@index');
        Route::post('/tarifas_solo/store','TarifaCuetoSolaController@store');
        Route::put('/tarifas_solo/{id}','TarifaCuetoSolaController@update');
        Route::delete('/tarifas_solo/{id}','TarifaCuetoSolaController@destroy');
        Route::get('/tarifas_solo/{id}','TarifaCuetoSolaController@show');

        //----Pruebas TarifaConvenioController
        Route::get('/tarifas_convenio','TarifaConvenioController@index');
        Route::post('/tarifas_convenio/store','TarifaConvenioController@store');
        Route::put('/tarifas_convenio/{id}','TarifaConvenioController@update');
        Route::delete('/tarifas_convenio/{id}','TarifaConvenioController@destroy');
        Route::get('/tarifas_convenio/{id}','TarifaConvenioController@show');

        //----Pruebas TarifaConvenioSolaController
        Route::get('/tarifas_convenio_sola','TarifaConvenioSolaController@index');
        Route::post('/tarifas_convenio_sola/store','TarifaConvenioSolaController@store');
        Route::put('/tarifas_convenio_sola/{id}','TarifaConvenioSolaController@update');
        Route::delete('/tarifas_convenio_sola/{id}','TarifaConvenioSolaController@destroy');
        Route::get('/tarifas_convenio_sola/{id}','TarifaConvenioSolaController@show');

        //----Pruebas ReciboController
        Route::get('/recibos','ReciboController@index');
        Route::get('/recibos/{cartera_id}','ReciboController@recibosCartera');
        Route::post('/recibos/{cartera_id}','ReciboController@store');
        Route::put('/recibos/{id}','ReciboController@update');
        Route::delete('/recibos/{id}','ReciboController@destroy');
        Route::get('/recibos/{id}','ReciboController@show');
    

    Route::group(['middleware' => 'jwt-auth'], function(){


    });
});
