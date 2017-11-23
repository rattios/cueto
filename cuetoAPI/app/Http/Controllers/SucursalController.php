<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class SucursalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los sucursales
        $sucursales = \App\Sucursal::all();

        if(count($sucursales) == 0){
            return response()->json(['error'=>'No existen sucursales.'], 404);          
        }else{
            return response()->json(['status'=>'ok', 'sucursales'=>$sucursales], 200);
        } 
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('nombre') || !$request->input('direccion') ||
            !$request->input('telefono') || !$request->input('correo'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 
        
        $aux = \App\Sucursal::where('correo', $request->input('correo'))->get();
        if(count($aux)!=0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Ya existe una sucursal con ese correo.'], 409);
        }

        if($nuevaSucursal=\App\Sucursal::create($request->all())){
           return response()->json(['status'=>'ok', 'sucursal'=>$nuevaSucursal], 200);
        }else{
            return response()->json(['error'=>'Error al crear la sucursal.'], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //cargar una sucursal
        $sucursal = \App\Sucursal::find($id);

        if(count($sucursal)==0){
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);          
        }else{

            return response()->json(['status'=>'ok', 'sucursal'=>$sucursal], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Comprobamos si la sucursal que nos están pasando existe o no.
        $sucursal=\App\Sucursal::find($id);

        if (count($sucursal)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $nombre=$request->input('nombre'); 
        $direccion=$request->input('direccion'); 
        $telefono=$request->input('telefono'); 
        $correo=$request->input('correo');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($nombre != null && $nombre!='')
        {
            $sucursal->nombre = $nombre;
            $bandera=true;
        }

        if ($direccion != null && $direccion!='')
        {
            $sucursal->direccion = $direccion;
            $bandera=true;
        }

        if ($telefono != null && $telefono!='')
        {
            $sucursal->telefono = $telefono;
            $bandera=true;
        }

        if ($correo != null && $correo!='')
        {
            $aux = \App\Sucursal::where('correo', $request->input('correo'))
            ->where('id', '<>', $sucursal->id)->get();

            if(count($aux)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otra sucursal con ese correo.'], 409);
            }

            $sucursal->correo = $correo;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($sucursal->save()) {
                return response()->json(['status'=>'ok','sucursal'=>$sucursal], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar la sucursal.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato de la sucursal.'],304);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Comprobamos si la sucursal que nos están pasando existe o no.
        $sucursal=\App\Sucursal::find($id);

        if(count($sucursal)==0){
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);          
        }
       
        $usuarios = $sucursal->usuarios;
        $clientes = $sucursal->clientes;
        $carteras = $sucursal->carteras;
        $convenios = $sucursal->convenios;
        $pagos = $sucursal->pagos;
        $contratos = $sucursal->contratos;
        $empleados = $sucursal->empleados;
        $familiares = $sucursal->familiares;
        $rendiciones = $sucursal->rendiciones;
        $recibos = $sucursal->recibos;
        $docsCanceladores = $sucursal->docsCanceladores;

        if (sizeof($usuarios) > 0 || sizeof($clientes) > 0 || sizeof($carteras) > 0 ||
            sizeof($convenios) > 0 || sizeof($pagos) > 0 || sizeof($contratos) > 0 ||
            sizeof($empleados) > 0 || sizeof($familiares) > 0 || sizeof($rendiciones) > 0 ||
            sizeof($recibos) > 0 || sizeof($docsCanceladores) > 0 )
        {
            // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Esta sucursal posee relaciones y no puede ser eliminada.'], 409);
        }

        // Eliminamos la sucursal si no tiene relaciones.
        $sucursal->delete();

        return response()->json(['status'=>'ok', 'message'=>'Se ha eliminado correctamente la sucursal.'], 200);
    }

    public function sucursalesInformacion()
    {
        //cargar todas las sucursales con toda su informacion asociada
        $sucursales = \App\Sucursal::with('usuarios')->with('clientes')
                ->with('carteras')->with('convenios')->get();

        if(count($sucursales) == 0){
            return response()->json(['error'=>'No existen sucursales.'], 404);          
        }else{
            return response()->json(['status'=>'ok', 'sucursales'=>$sucursales], 200);
        }
    }

    public function sucursalInformacion($id)
    {
        //cargar una sucursal con toda su informacion asociada
        $sucursal = \App\Sucursal::where('id', $id)->with('usuarios')->with('clientes')
                ->with('carteras')->with('convenios')->get();

        if(count($sucursal) == 0){
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);          
        }else{
            return response()->json(['status'=>'ok', 'sucursal'=>$sucursal], 200);
        }
    }

    public function sucursalUsuarios($id)
    {
        //cargar una sucursal con sus usuarios
        $sucursal = \App\Sucursal::where('id', $id)->with('usuarios')->get();

        if(count($sucursal) == 0){
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);          
        }else{
            return response()->json(['status'=>'ok', 'sucursal'=>$sucursal], 200);
        }
    }

    public function sucursalClientes($id)
    {
        //cargar una sucursal con sus clientes
        $sucursal = \App\Sucursal::where('id', $id)->with('clientes')->get();

        if(count($sucursal) == 0){
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);          
        }else{
            return response()->json(['status'=>'ok', 'sucursal'=>$sucursal], 200);
        }
    }

    public function sucursalCarteras($id)
    {
        //cargar una sucursal con toda su informacion asociada
        $sucursal = \App\Sucursal::where('id', $id)->with(['carteras.tickets' => function ($query) {
                $query->where('cliente_id', null);
            }])->get();

        if(count($sucursal) == 0){
            return response()->json(['error'=>'No existe la sucursal con id '.$id], 404);          
        }else{
            return response()->json(['status'=>'ok', 'sucursal'=>$sucursal], 200);
        }
    }
}
