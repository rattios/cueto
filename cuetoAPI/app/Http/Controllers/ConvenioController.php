<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ConvenioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->input('sucursal_id')) {

            //cargar todos los convenios de todas las sucursales
            $convenios = \App\Convenio::all();

            if(count($convenios) == 0){
                return response()->json(['error'=>'No existen convenios.'], 404);          
            }else{
                return response()->json(['status'=>'ok', 'convenios'=>$convenios], 200);
            }
        }
        else{
            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            //cargar todos los convenios de una sucursal
            $convenios = \App\Convenio::where('sucursal_id', $request->input('sucursal_id'))
                ->get();

            if(count($convenios) == 0){
                return response()->json(['error'=>'No existen convenios en la sucursal con id '.$request->input('sucursal_id')], 404);          
            }else{
                return response()->json(['status'=>'ok', 'convenios'=>$convenios], 200);
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
        if (!$request->input('estado') || !$request->input('empresa') ||
            !$request->input('direccion') || !$request->input('telefono') ||
            !$request->input('correo') || !$request->input('sucursal_id') 
            )
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 

        // Comprobamos si la sucursal que nos están pasando existe o no.
        $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

        if(count($sucursal)==0){
            return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
        }


        if($nuevoConvenio=\App\Convenio::create($request->all())){
           return response()->json(['status'=>'ok', 'convenio'=>$nuevoConvenio], 200);
        }else{
            return response()->json(['error'=>'Error al crear el convenio.'], 500);
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
        //cargar un convenio
        $convenio = \App\Convenio::find($id);

        if(count($convenio)==0){
            return response()->json(['error'=>'No existe el convenio con id '.$id], 404);          
        }else{

            return response()->json(['status'=>'ok', 'convenio'=>$convenio], 200);
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
        // Comprobamos si el convenio que nos están pasando existe o no.
        $convenio=\App\Convenio::find($id);

        if (count($convenio)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el convenio con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente. 
        $estado=$request->input('estado'); 
        $empresa=$request->input('empresa');
        $direccion=$request->input('direccion'); 
        $telefono=$request->input('telefono');
        $correo=$request->input('correo');  
        //$sucursal_id=$request->input('sucursal_id');   

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($estado != null && $estado!='')
        {
            $convenio->estado = $estado;
            $bandera=true;
        }

        if ($empresa != null && $empresa!='')
        {
            $convenio->empresa = $empresa;
            $bandera=true;
        }

        if ($direccion != null && $direccion!='')
        {
            $convenio->direccion = $direccion;
            $bandera=true;
        }

        if ($telefono != null && $telefono!='')
        {
            $convenio->telefono = $telefono;
            $bandera=true;
        }

        if ($correo != null && $correo!='')
        {
            $convenio->correo = $correo;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($convenio->save()) {
                return response()->json(['status'=>'ok','convenio'=>$convenio], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el convenio.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del convenio.'],304);
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
        //
    }
}
