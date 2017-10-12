<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CarteraController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->input('sucursal_id')) {

            //cargar todas las carteras de todas las sucursales
            $carteras = \App\Cartera::all();

            if(count($carteras) == 0){
                return response()->json(['error'=>'No existen carteras.'], 404);          
            }else{
                return response()->json(['status'=>'ok', 'carteras'=>$carteras], 200);
            }
        }
        else{
            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            //cargar todas las carteras de una sucursal
            $carteras = \App\Cartera::where('sucursal_id', $request->input('sucursal_id'))
                ->get();

            if(count($carteras) == 0){
                return response()->json(['error'=>'No existen carteras en la sucursal con id '.$request->input('sucursal_id')], 404);          
            }else{
                return response()->json(['status'=>'ok', 'carteras'=>$carteras], 200);
            }
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
        if ( !$request->input('numero') || !$request->input('nombre') ||
             !$request->input('sucursal_id'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 

        // Comprobamos si la sucursal que nos están pasando existe o no.
        $sucursal=\App\Sucursal::find($request->input('sucursal_id'));
        if (count($sucursal)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);
        }
        
        $aux = \App\Cartera::where('numero', $request->input('numero'))->
                where('sucursal_id', $request->input('sucursal_id'))->get();
        if(count($aux) != 0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Ya existe una cartera con ese número en la sucursal.'], 409);
        }

        if($nuevaCartera=\App\Cartera::create($request->all())){
           return response()->json(['status'=>'ok', 'cartera'=>$nuevaCartera], 200);
        }else{
            return response()->json(['error'=>'Error al crear la cartera.'], 500);
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
        //cargar una cartera
        $cartera = \App\Cartera::find($id);

        if(count($cartera)==0){
            return response()->json(['error'=>'No existe la cartera con id '.$id], 404);          
        }else{

            return response()->json(['status'=>'ok', 'cartera'=>$cartera], 200);
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
        // Comprobamos si la cartera que nos están pasando existe o no.
        $cartera = \App\Cartera::find($id);

        if (count($cartera)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la cartera con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $numero=$request->input('numero'); 
        $nombre=$request->input('nombre'); 
        $descripcion=$request->input('descripcion'); 

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($numero != null && $numero!='')
        {
            $aux = \App\Cartera::where('numero', $request->input('numero'))->
                where('sucursal_id', $cartera->sucursal_id)->
                where('id', '<>', $cartera->id)->get();

            if(count($aux) != 0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otra cartera con ese número en la sucursal.'], 409);
            }

            $cartera->numero = $numero;
            $bandera=true;
        }

        if ($nombre != null && $nombre!='')
        {
            $cartera->nombre = $nombre;
            $bandera=true;
        }

        if ($descripcion != null && $descripcion!='')
        {
            $cartera->descripcion = $descripcion;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($cartera->save()) {
                return response()->json(['status'=>'ok','cartera'=>$cartera], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar la cartera.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato de la cartera.'],304);
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
        // Comprobamos si la cartera que nos están pasando existe o no.
        $cartera = \App\Cartera::find($id);

        if (count($cartera)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe la cartera con id '.$id], 404);
        }
       
        $clientes = $cartera->clientes;
        $rendiciones = $cartera->rendiciones;
        $vendedor = $cartera->vendedor;
       

        if (sizeof($clientes) > 0 || sizeof($rendiciones) > 0 || sizeof($vendedor) > 0 )
        {
            // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Esta cartera posee relaciones y no puede ser eliminada.'], 409);
        }

        // Eliminamos la cartera si no tiene relaciones.
        $cartera->delete();

        return response()->json(['status'=>'ok', 'message'=>'Se ha eliminado correctamente la cartera.'], 200);
    }

    /*public function carterasSucursal($sucursal_id)
    {
        // Comprobamos si la sucursal que nos están pasando existe o no.
        $sucursal=\App\Sucursal::find($sucursal_id);

        if(count($sucursal)==0){
            return response()->json(['error'=>'No existe la sucursal con id '.$sucursal_id], 404);          
        }

        //cargar todas las carteras de una sursal
        $carteras = \App\Cartera::where('sucursal_id', $sucursal_id)->get();

        if(count($carteras) == 0){
            return response()->json(['error'=>'No existen carteras en la sucursal con id '.$sucursal_id], 404);          
        }else{
            return response()->json(['status'=>'ok', 'carteras'=>$carteras], 200);
        }
    }*/

    public function carteraClientes($id)
    {
        //cargar una cartera con sus clientes
        $cartera = \App\Cartera::where('id', $id)->with('clientes')->get();

        if(count($cartera) == 0){
            return response()->json(['error'=>'No existe la cartera con id '.$id], 404);          
        }else{
            return response()->json(['status'=>'ok', 'cartera'=>$cartera], 200);
        }
    }
}
