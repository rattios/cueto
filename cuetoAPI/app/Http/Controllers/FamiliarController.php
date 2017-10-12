<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class FamiliarController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->input('sucursal_id')) {

            //cargar todos los familiares de todas las sucursales
            $familiares = \App\Familiar::all();

            if(count($familiares) == 0){
                return response()->json(['error'=>'No existen familiares.'], 404);          
            }else{
                return response()->json(['status'=>'ok', 'familiares'=>$familiares], 200);
            }
        }
        else{
            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            //cargar todos los familiares de una sucursal
            $familiares = \App\Familiar::where('sucursal_id', $request->input('sucursal_id'))
                ->get();

            if(count($familiares) == 0){
                return response()->json(['error'=>'No existen familiares en la sucursal con id '.$request->input('sucursal_id')], 404);          
            }else{
                return response()->json(['status'=>'ok', 'familiares'=>$familiares], 200);
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
        //Nota: el parametro 'observaciones' es no requerido.

        // Primero comprobaremos si estamos recibiendo todos los campos.
        if (!$request->input('nombre_1') || !$request->input('nombre_2') ||
            !$request->input('apellido_1') || !$request->input('apellido_2') ||
            !$request->input('dni') || !$request->input('direccion') ||
            !$request->input('f_nacimineto') || !$request->input('sexo') ||
            !$request->input('vinculo') || !$request->input('sucursal_id')
            )
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 

        //Se debe pasar uno de los dos para indicar la relacion con el titular
        if (!$request->input('cliente_id') && !$request->input('empleado_id') )
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        }

        // Comprobamos si la sucursal que nos están pasando existe o no.
        $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

        if(count($sucursal)==0){
            return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
        }

        //Si es familiar de un AF_CUETO
        if ($request->input('cliente_id'))
        {
            // Comprobamos si el cliente titular que nos están pasando existe o no.
            $cliente = \App\Cliente::where('id', $request->input('cliente_id'))
                    ->where('tipo', 'AF_CUETO')->get();

            if(count($cliente)==0){
                return response()->json(['error'=>'No existe el cliente con id '.$request->input('cliente_id').
                            ', o no es un afiliado cueto con grupo familiar.'], 404);          
            } 
        }

        //Si es familiar de un empleado
        if ($request->input('empleado_id'))
        {
            // Comprobamos si el empleado que nos están pasando existe o no.
            $empleado = \App\Empleado::find($request->input('empleado_id'));

            if(count($empleado)==0){
                return response()->json(['error'=>'No existe el empleado con id '.$request->input('empleado_id')], 404);          
            } 
        }

        if($nuevoFamiliar=\App\Familiar::create($request->all())){
           return response()->json(['status'=>'ok', 'familiar'=>$nuevoFamiliar], 200);
        }else{
            return response()->json(['error'=>'Error al crear el familiar.'], 500);
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
        //cargar un familiar
        $familiar = \App\Familiar::find($id);

        if(count($familiar)==0){
            return response()->json(['error'=>'No existe el familiar con id '.$id], 404);          
        }else{

            return response()->json(['status'=>'ok', 'familiar'=>$familiar], 200);
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
        // Comprobamos si el familiar que nos están pasando existe o no.
        $familiar=\App\Familiar::find($id);

        if (count($familiar)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el familiar con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente. 
        $nombre_1=$request->input('nombre_1'); 
        $nombre_2=$request->input('nombre_2');
        $apellido_1=$request->input('apellido_1'); 
        $apellido_2=$request->input('apellido_2');
        $dni=$request->input('dni');
        $direccion=$request->input('direccion'); 
        $f_nacimineto=$request->input('f_nacimineto');   
        $sexo=$request->input('sexo');
        $vinculo=$request->input('vinculo'); 
        $observaciones=$request->input('observaciones');  
        //$sucursal_id=$request->input('sucursal_id');   

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($nombre_1 != null && $nombre_1!='')
        {
            $familiar->nombre_1 = $nombre_1;
            $bandera=true;
        }

        if ($nombre_2 != null && $nombre_2!='')
        {
            $familiar->nombre_2 = $nombre_2;
            $bandera=true;
        }

        if ($apellido_1 != null && $apellido_1!='')
        {
            $familiar->apellido_1 = $apellido_1;
            $bandera=true;
        }

        if ($apellido_2 != null && $apellido_2!='')
        {
            $familiar->apellido_2 = $apellido_2;
            $bandera=true;
        }

        if ($dni != null && $dni!='')
        {
            $familiar->dni = $dni;
            $bandera=true;
        }

        if ($direccion != null && $direccion!='')
        {
            $familiar->direccion = $direccion;
            $bandera=true;
        }

        if ($f_nacimineto != null && $f_nacimineto!='')
        {
            $familiar->f_nacimineto = $f_nacimineto;
            $bandera=true;
        }

        if ($sexo != null && $sexo!='')
        {
            $familiar->sexo = $sexo;
            $bandera=true;
        }

        if ($vinculo != null && $vinculo!='')
        {
            $familiar->vinculo = $vinculo;
            $bandera=true;
        }

        if ($observaciones != null && $observaciones!='')
        {
            $familiar->observaciones = $observaciones;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($familiar->save()) {
                return response()->json(['status'=>'ok','familiar'=>$familiar], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el familiar.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del familiar.'],304);
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
        // Comprobamos si el familiar que nos están pasando existe o no.
        $familiar=\App\Familiar::find($id);

        if (count($familiar)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el familiar con id '.$id], 404);
        }

        // Eliminamos el familiar.
        $familiar->delete();

        return response()->json(['status'=>'ok', 'message'=>'Se ha eliminado correctamente el familiar.'], 200);
    }
}
