<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Hash;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->input('sucursal_id')) {

            //cargar todos los usuarios de todas las sucursales
            $usuarios = \App\User::all();

            if(count($usuarios) == 0){
                return response()->json(['error'=>'No existen usuarios.'], 404);          
            }else{
                return response()->json(['status'=>'ok', 'usuarios'=>$usuarios], 200);
            }
        }
        else{
            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            //cargar todos los usuarios de una sucursal
            $usuarios = \App\User::where('sucursal_id', $request->input('sucursal_id'))
                ->get();

            if(count($usuarios) == 0){
                return response()->json(['error'=>'No existen usuarios en la sucursal con id '.$request->input('sucursal_id')], 404);          
            }else{
                return response()->json(['status'=>'ok', 'usuarios'=>$usuarios], 200);
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
        if ( !$request->input('user') || !$request->input('password') ||
            !$request->input('correo') || !$request->input('rol') ||
            !$request->input('nombre') || !$request->input('apellido') ||
            !$request->input('telefono')
            )
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 

        /*Si se van a crear roles distintos a SU(super-usuario) y ADMIN(administrador)
        se debe pasar la sucursal*/
        if ($request->input('rol') != 'SU' && $request->input('rol') != 'ADMIN') {
            if ( !$request->input('sucursal_id')) {
                // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
                return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
            }
            
        }

        /*Si se va a crear un rol=VC(vendedor/cobrador) se debe pasar tambien la cartera
         a la que pertenece*/
        /*if ($request->input('rol') == 'VC' && !$request->input('cartera_id')) {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        }
        else if ($request->input('rol') == 'VC' && $request->input('cartera_id')){

            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            // Comprobamos si la cartera que nos están pasando existe o no.
            $cartera = \App\Cartera::where('id', $request->input('cartera_id'))
                    ->where('sucursal_id', $request->input('sucursal_id'))->get();

            if(count($cartera)==0){
                return response()->json(['error'=>'No existe la cartera con id '.$request->input('cartera_id').', o no está asociada a la sucursal.'], 404);          
            }
           
            $vendedor = $cartera[0]->vendedor;

            if (sizeof($vendedor) > 0 )
            {
                // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'La cartera ya tiene un vendedor asociado.'], 409);
            }
        }*/
        
        $aux = \App\User::where('user', $request->input('user'))
            ->orWhere('correo', $request->input('correo'))->get();
        if(count($aux)!=0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Ya existe un usuario con esas credenciales.'], 409);
        }

        /*Primero creo una instancia en la tabla usuarios*/
        $usuario = new \App\User;
        $usuario->user = $request->input('user');
        $usuario->password = Hash::make($request->input('password'));
        $usuario->correo = $request->input('correo');
        $usuario->rol = $request->input('rol');
        $usuario->nombre = $request->input('nombre');
        $usuario->apellido = $request->input('apellido');
        $usuario->telefono = $request->input('telefono');
        $usuario->sucursal_id = $request->input('sucursal_id');
        //$usuario->cartera_id = $request->input('cartera_id');

        if($usuario->save()){
           return response()->json(['status'=>'ok', 'usuario'=>$usuario], 200);
        }else{
            return response()->json(['error'=>'Error al crear el usuario.'], 500);
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
        //cargar un usuario
        $usuario = \App\User::find($id);

        if(count($usuario)==0){
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);          
        }else{

            return response()->json(['status'=>'ok', 'usuario'=>$usuario], 200);
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
        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($id);

        if (count($usuario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $user=$request->input('user'); 
        $password=$request->input('password'); 
        $correo=$request->input('correo');
        //$rol=$request->input('rol'); 
        $nombre=$request->input('nombre');
        $apellido=$request->input('apellido');
        $telefono=$request->input('telefono');     

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($user != null && $user!='')
        {
            $aux = \App\User::where('user', $request->input('user'))
            ->where('id', '<>', $usuario->id)->get();

            if(count($aux)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otro usuario con ese user.'], 409);
            }

            $usuario->user = $user;
            $bandera=true;
        }

        if ($password != null && $password!='')
        {
            $usuario->password = Hash::make($request->input('password'));
            $bandera=true;
        }

        if ($correo != null && $correo!='')
        {
            $aux = \App\User::where('correo', $request->input('correo'))
            ->where('id', '<>', $usuario->id)->get();

            if(count($aux)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otro usuario con ese correo.'], 409);
            }

            $usuario->correo = $correo;
            $bandera=true;
        }

        /*if ($rol != null && $rol!='')
        {
            $usuario->rol = $rol;
            $bandera=true;
        }*/

        if ($nombre != null && $nombre!='')
        {
            $usuario->nombre = $nombre;
            $bandera=true;
        }

        if ($apellido != null && $apellido!='')
        {
            $usuario->apellido = $apellido;
            $bandera=true;
        }

        if ($telefono != null && $telefono!='')
        {
            $usuario->telefono = $telefono;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($usuario->save()) {
                return response()->json(['status'=>'ok','usuario'=>$usuario], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el usuario.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del usuario.'],304);
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
        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($id);

        if (count($usuario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);
        }

        //$cartera = $usuario->cartera;
        $rendiciones = $usuario->rendiciones;
        $autorizaciones = $usuario->autorizaciones;
       

        if (/*sizeof($cartera) > 0 ||*/ sizeof($rendiciones) > 0 || sizeof($autorizaciones) > 0 )
        {
            // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Este usuario posee relaciones y no puede ser eliminado.'], 409);
        }

        // Eliminamos el usuario si no tiene relaciones.
        $usuario->delete();

        return response()->json(['status'=>'ok', 'message'=>'Se ha eliminado correctamente el usuario.'], 200);
    }

    public function vendedores(Request $request)
    {
        if (!$request->input('sucursal_id')) {

            /*Cargar todos los vendedores de todas las sucursales*/
            $vendedores = \App\User::where('rol', 'VC')->get();

            if(count($vendedores) == 0){
                return response()->json(['error'=>'No existen vendedores.'], 404);          
            }else{
                return response()->json(['status'=>'ok', 'vendedores'=>$vendedores], 200);
            }
        }
        else{
            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            /*Cargar todos los vendedores de una sucursal
            con la cartera que tienen asociada*/
            $vendedores = \App\User::where('rol', 'VC')
                ->where('sucursal_id', $request->input('sucursal_id'))
                ->get();

            if(count($vendedores) == 0){
                return response()->json(['error'=>'No existen vendedores en la sucursal con id '.$sucursal_id], 404);          
            }else{
                return response()->json(['status'=>'ok', 'vendedores'=>$vendedores], 200);
            }
        }

    }

    public function vendedoresCartera(Request $request)
    {
        if (!$request->input('sucursal_id')) {

            /*Cargar todos los vendedores de todas las sucursales
            con la cartera que tienen asociada*/
            $vendedores = \App\User::where('rol', 'VC')
                ->with('cartera')->get();

            if(count($vendedores) == 0){
                return response()->json(['error'=>'No existen vendedores.'], 404);          
            }else{
                return response()->json(['status'=>'ok', 'vendedores'=>$vendedores], 200);
            }
        }
        else{
            // Comprobamos si la sucursal que nos están pasando existe o no.
            $sucursal=\App\Sucursal::find($request->input('sucursal_id'));

            if(count($sucursal)==0){
                return response()->json(['error'=>'No existe la sucursal con id '.$request->input('sucursal_id')], 404);          
            }

            /*Cargar todos los vendedores de una sucursal
            con la cartera que tienen asociada*/
            $vendedores = \App\User::where('rol', 'VC')
                ->where('sucursal_id', $request->input('sucursal_id'))
                ->with('cartera')->get();

            if(count($vendedores) == 0){
                return response()->json(['error'=>'No existen vendedores en la sucursal con id '.$request->input('sucursal_id')], 404);          
            }else{
                return response()->json(['status'=>'ok', 'vendedores'=>$vendedores], 200);
            }
        }

    }
}
