<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class TarifaConvenioSolaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return \App\TarifaConvenioSola::All();
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
        
        if($nuevoConvenio=\App\TarifaConvenioSola::create($request->all())){
           return response()->json(['status'=>'ok', 'TarifaConvenioSola'=>$nuevoConvenio], 200);
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
        $convenio=\App\TarifaConvenioSola::find($id);

        $convenio->fill($request->all());
        // Almacenamos en la base de datos el registro.
        if ($convenio->save()) {
            return response()->json(['status'=>'ok','convenio'=>$convenio], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar el convenio.'], 500);
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
        $convenio=\App\TarifaConvenioSola::find($id);

        if ($convenio->delete()) {
            return response()->json(['status'=>'ok','convenio'=>$convenio], 200);
        }else{
            return response()->json(['error'=>'Error al actualizar el convenio.'], 500);
        }
    }
}
