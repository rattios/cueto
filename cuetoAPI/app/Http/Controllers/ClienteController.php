<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->input('sucursal_id')) {

            //cargar todos los clientes de todas las sucursales
            $clientes = \App\Cliente::all();

            if(count($clientes) == 0){
                return response()->json(['error'=>'No existen clientes.'], 404);          
            }else{
                return response()->json(['status'=>'ok', 'clientes'=>$clientes], 200);
            }
        }
        else{
            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            //cargar todos los clientes de una sucursal
            $clientes = \App\Cliente::where('sucursal_id', $request->input('sucursal_id'))
                ->get();

            if(count($clientes) == 0){
                return response()->json(['error'=>'No existen clientes en la sucursal con id '.$request->input('sucursal_id')], 404);          
            }else{
                return response()->json(['status'=>'ok', 'clientes'=>$clientes], 200);
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
        //Nota: el parametro 'cuota' es no requerido.

        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('tipo') || !$request->input('nombre_1') ||
            !$request->input('nombre_2') || !$request->input('apellido_1') ||
            !$request->input('apellido_2') || !$request->input('dni') ||
            !$request->input('direccion') || !$request->input('f_nacimineto') ||
            !$request->input('estado') || !$request->input('sexo') ||
            !$request->input('sucursal_id')
            )
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 

        /*Si se va a crear un tipo=AF_CUETO o un tipo=AF_CUETO_S
         se debe pasar tambien la cartera a la que pertenece*/
        if (($request->input('tipo') == 'AF_CUETO' || $request->input('tipo') == 'AF_CUETO_S') && !$request->input('cartera_id')) {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        }
        else if (($request->input('tipo') == 'AF_CUETO' || $request->input('tipo') == 'AF_CUETO_S') && $request->input('cartera_id')){

            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            // Comprobamos si la cartera que nos están pasando existe o no.
            $cartera = \App\Cartera::where('id', $request->input('cartera_id'))
                    ->where('sucursal_id', $request->input('sucursal_id'))->get();

            if(count($cartera)==0){
                return response()->json(['error'=>'No existe la cartera con id '.$request->input('cartera_id').', o no asociada la sucursal.'], 404);          
            }   
        }
        
        /*Si se va a crear un tipo=AF_CONV o un tipo=AF_CONV_S
         se debe pasar tambien el convenio al que pertenece*/
        if (($request->input('tipo') == 'AF_CONV' || $request->input('tipo') == 'AF_CONV_S') && !$request->input('convenio_id')) {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        }
        else if (($request->input('tipo') == 'AF_CONV' || $request->input('tipo') == 'AF_CONV_S') && $request->input('convenio_id')){

            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            // Comprobamos si el convenio que nos están pasando existe o no.
            $convenio = \App\Convenio::where('id', $request->input('convenio_id'))
                    ->where('sucursal_id', $request->input('sucursal_id'))->get();

            if(count($convenio)==0){
                return response()->json(['error'=>'No existe el convenio con id '.$request->input('convenio_id').', o no está asociado a la sucursal.'], 404);          
            }   
        }

        if($nuevoCliente=\App\Cliente::create($request->all())){
           return response()->json(['status'=>'ok', 'cliente'=>$nuevoCliente], 200);
        }else{
            return response()->json(['error'=>'Error al crear el cliente.'], 500);
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
        //cargar un cliente
        $cliente = \App\Cliente::find($id);

        if(count($cliente)==0){
            return response()->json(['error'=>'No existe el cliente con id '.$id], 404);          
        }else{

            return response()->json(['status'=>'ok', 'cliente'=>$cliente], 200);
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
        // Comprobamos si el cliente que nos están pasando existe o no.
        $cliente=\App\Cliente::find($id);

        if (count($cliente)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cliente con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $tipo=$request->input('tipo'); 
        $nombre_1=$request->input('nombre_1'); 
        $nombre_2=$request->input('nombre_2');
        $apellido_1=$request->input('apellido_1'); 
        $apellido_2=$request->input('apellido_2');
        $dni=$request->input('dni');
        $direccion=$request->input('direccion'); 
        $f_nacimineto=$request->input('f_nacimineto');  
        $estado=$request->input('estado'); 
        $sexo=$request->input('sexo'); 
        $cuota=$request->input('cuota');   
        //$sucursal_id=$request->input('sucursal_id');   

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($tipo != null && $tipo!='')
        {
            $cliente->tipo = $tipo;
            $bandera=true;
        }

        if ($nombre_1 != null && $nombre_1!='')
        {
            $cliente->nombre_1 = $nombre_1;
            $bandera=true;
        }

        if ($nombre_2 != null && $nombre_2!='')
        {
            $cliente->nombre_2 = $nombre_2;
            $bandera=true;
        }

        if ($apellido_1 != null && $apellido_1!='')
        {
            $cliente->apellido_1 = $apellido_1;
            $bandera=true;
        }

        if ($apellido_2 != null && $apellido_2!='')
        {
            $cliente->apellido_2 = $apellido_2;
            $bandera=true;
        }

        if ($dni != null && $dni!='')
        {
            $cliente->dni = $dni;
            $bandera=true;
        }

        if ($direccion != null && $direccion!='')
        {
            $cliente->direccion = $direccion;
            $bandera=true;
        }

        if ($f_nacimineto != null && $f_nacimineto!='')
        {
            $cliente->f_nacimineto = $f_nacimineto;
            $bandera=true;
        }

        if ($estado != null && $estado!='')
        {
            $cliente->estado = $estado;
            $bandera=true;
        }

        if ($sexo != null && $sexo!='')
        {
            $cliente->sexo = $sexo;
            $bandera=true;
        }

        if ($cuota != null && $cuota!='')
        {
            $cliente->cuota = $cuota;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($cliente->save()) {
                return response()->json(['status'=>'ok','cliente'=>$cliente], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el cliente.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del cliente.'],304);
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
        // Comprobamos si el cliente que nos están pasando existe o no.
        $cliente=\App\Cliente::find($id);

        if (count($cliente)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el cliente con id '.$id], 404);
        }

        $convenio = $cliente->convenio;
        $cartera = $cliente->cartera;
        $pagos = $cliente->pagos;
        $contrato = $cliente->contrato;
        $empleados = $cliente->empleados;
        $familiares = $cliente->familiares;
        $recibos = $cliente->recibos;

        if (sizeof($convenio) > 0 || sizeof($cartera) > 0 || sizeof($pagos) > 0 ||
            sizeof($contrato) > 0 || sizeof($empleados) > 0 || sizeof($familiares) > 0 ||
            sizeof($recibos) > 0 )
        {
            // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Este cliente posee relaciones y no puede ser eliminado.'], 409);
        }

        // Eliminamos el cliente si no tiene relaciones.
        $cliente->delete();

        return response()->json(['status'=>'ok', 'message'=>'Se ha eliminado correctamente el cliente.'], 200);
    }
}
