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
        //Nota: el parametro 'observaciones' nombre_2  apellido_2 es no requerido.

        // Primero comprobaremos si estamos recibiendo todos los campos.
        /*if (!$request->input('nombre_1') /*|| !$request->input('nombre_2') ||
            !$request->input('apellido_1') /*|| !$request->input('apellido_2') ||
            !$request->input('dni') || !$request->input('direccion') ||
            !$request->input('f_nacimiento') || !$request->input('sexo') ||
            !$request->input('vinculo') || !$request->input('sucursal_id')
            )
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } */

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

        //verificar que no exista ninguna persona en toda la BD con ese dni
        $auxCliente = \App\Cliente::where('dni', $request->input('dni'))->get();
        if(count($auxCliente)!=0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Existe un cliente con el dni '.$request->input('dni')], 409);
        }

        $auxFamiliar = \App\Familiar::where('dni', $request->input('dni'))->get();
        if(count($auxFamiliar)!=0){
            $titular = $auxFamiliar[0]->titular;
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Ya existe un familiar con el dni '.$request->input('dni'),
                'titular'=>$titular], 409);
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


        $dni=$request->input('dni');


        if ($dni != null && $dni!='')
        {
            //verificar que no exista ninguna persona en toda la BD con ese dni
            $auxCliente = \App\Cliente::where('dni', $request->input('dni'))->get();
            if(count($auxCliente)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Existe un cliente con el dni '.$request->input('dni')], 409);
            }

            $auxFamiliar = \App\Familiar::where('id', '<>', $familiar->id)->
                    where('dni', $request->input('dni'))->get();
            if(count($auxFamiliar)!=0){
                $titular = $auxFamiliar[0]->titular;
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otro familiar con el dni '.$request->input('dni'),
                    'titular'=>$titular], 409);
            }
        }
         $book = \App\Familiar::where('id',$id)->first();

         $book->fill($request->all());

        if($book->save()){
            return response()->json(['status'=>'ok','cliente'=>$book], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar el Familiar.'], 500);
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
