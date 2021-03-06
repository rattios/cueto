<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use BD;
use Illuminate\Support\Facades\DB;
use DateTime;

class RendicionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->input('estado')) {

            //Cargar las rendiciones 
            $rendiciones=\App\Rendicion::with('cartera')
                ->with('cobrador')
                ->with('recibos')
                ->with('docsCanceladores.pagos')
                ->get();

            if(count($rendiciones) == 0){
                return response()->json(['error'=>'No existen rendiciones.'], 404);          
            }else{

                for ($i=0; $i < count($rendiciones); $i++) { 
                    for ($j=0; $j < count($rendiciones[$i]->recibos) ; $j++) { 
                        $rendiciones[$i]->recibos[$j]->detalle = json_decode($rendiciones[$i]->recibos[$j]->detalle);
                        $rendiciones[$i]->recibos[$j]->deuda = json_decode($rendiciones[$i]->recibos[$j]->deuda);

                        if ($rendiciones[$i]->recibos[$j]->cliente->tipo == 'AF_CUETO') {
                            $rendiciones[$i]->recibos[$j]->cliente->familiares = $rendiciones[$i]->recibos[$j]->cliente->familiares;
                        }
                    }
                    

                }

                return response()->json(['status'=>'ok', 'rendiciones'=>$rendiciones], 200);
            }
        }
        else{
            //Cargar las rendiciones cun un estado especifico
            $rendiciones=\App\Rendicion::with('cartera')
                ->with('cobrador')
                ->with('recibos')
                ->with('docsCanceladores.pagos')
                ->where('estado',$request->input('estado'))
                ->get();

            if(count($rendiciones) == 0){
                return response()->json(['error'=>'No existen rendiciones con estado '.$request->input('estado')], 404);          
            }else{

                //return response()->json(['status'=>'ok', 'rendiciones'=>$rendiciones], 200);

                for ($i=0; $i < count($rendiciones); $i++) { 
                    for ($j=0; $j < count($rendiciones[$i]->recibos) ; $j++) { 
                        $rendiciones[$i]->recibos[$j]->detalle = json_decode($rendiciones[$i]->recibos[$j]->detalle);
                        $rendiciones[$i]->recibos[$j]->deuda = json_decode($rendiciones[$i]->recibos[$j]->deuda);

                        if ($rendiciones[$i]->recibos[$j]->cliente->tipo == 'AF_CUETO') {
                            $rendiciones[$i]->recibos[$j]->cliente->familiares = $rendiciones[$i]->recibos[$j]->cliente->familiares;
                        }
                    }
                    

                }

                return response()->json(['status'=>'ok', 'rendiciones'=>$rendiciones], 200);
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
    //Generar la rendicion de la cartera_id
    public function store(Request $request, $cartera_id)
    {
        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('monto') || !$request->input('recibos') )
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta false.'],422);
        } 

        //Comprobamos si la cartera que nos están pasando existe o no.
        $cartera=\App\Cartera::find($cartera_id);

        if(count($cartera)==0){
            return response()->json(['error'=>'No existe la cartera con id '.$cartera_id], 404);          
        }

        set_time_limit(300);

        //Tratamiento de los recibos a rendir
        $recibos = json_decode($request->input('recibos'));

        //return response()->json(['status'=>'ok', 'recibos'=>$recibos], 200);

        //Generar rendicion
        $rendicion = new \App\Rendicion;
        $rendicion->estado='P';
        $rendicion->monto=$request->input('monto');
        $rendicion->sucursal_id=$cartera->sucursal_id;
        $rendicion->cartera_id=$cartera->id;
        $rendicion->cobrador_id=$cartera->vendedor_id;
        //$rendicion->autorizante_id=;
        //$rendicion->f_autorizacion=;
        $rendicion->save();

        for ($i=0; $i < count($recibos) ; $i++) { 
            //El cliente no pago nada
            if ($recibos[$i]->abono == 0) {

                //Extraer el total de los importes parciales
                $detalleAux = $recibos[$i]->detalle;
                $montoAux = 0;
                for ($m=0; $m < count($detalleAux); $m++) { 
                    $montoAux = $montoAux + $detalleAux[$m]->importeParcial;
                }

                //Generar deuda
                $nuevaDeuda = new \App\Deuda;
                $nuevaDeuda->monto=$montoAux;
                $nuevaDeuda->mes=$recibos[$i]->item->mes;
                $nuevaDeuda->anio=$recibos[$i]->item->anio;
                $nuevaDeuda->sucursal_id=$recibos[$i]->item->sucursal_id;
                $nuevaDeuda->cliente_id=$recibos[$i]->item->cliente_id;
                $nuevaDeuda->recibo_id=$recibos[$i]->item->id;
                $nuevaDeuda->save();

                //Rendir recibo
                DB::table('recibos')
                    ->where('id', $recibos[$i]->item->id)
                    ->update(['estado' => 'R',
                        'rendicion_id' => $rendicion->id]);

            }
            //El cliente pago a medias
            else if ($recibos[$i]->abono > 0 && $recibos[$i]->abono < $recibos[$i]->importe) {

                //Cargar cliente
                $cliente = \App\Cliente::find($recibos[$i]->item->cliente_id);

                //Borrar deudas anteriores si las tiene
                $deudas = $cliente->deudas;    
                if (count($deudas)>0) {
                    for ($k=0; $k < count($deudas); $k++) { 
                        $deudas[$k]->delete();
                    } 
                }

                //Recalcular deuda
                $montoAux = $recibos[$i]->importe - $recibos[$i]->abono;

                //Generar deuda
                $nuevaDeuda = new \App\Deuda;
                $nuevaDeuda->monto=$montoAux;
                $nuevaDeuda->mes=$recibos[$i]->item->mes;
                $nuevaDeuda->anio=$recibos[$i]->item->anio;
                $nuevaDeuda->sucursal_id=$recibos[$i]->item->sucursal_id;
                $nuevaDeuda->cliente_id=$recibos[$i]->item->cliente_id;
                $nuevaDeuda->recibo_id=$recibos[$i]->item->id;
                $nuevaDeuda->save();

                //Rendir recibo
                DB::table('recibos')
                    ->where('id', $recibos[$i]->item->id)
                    ->update(['estado' => 'R',
                        'abono' => $recibos[$i]->abono,
                        'rendicion_id' => $rendicion->id]);

                //Generar documento cancelador
                $docCancelador = new \App\DocCancelador;
                $docCancelador->estado='P';
                $docCancelador->sucursal_id=$recibos[$i]->item->sucursal_id;
                $docCancelador->recibo_id=$recibos[$i]->item->id;
                $docCancelador->rendicion_id=$rendicion->id;
                $docCancelador->save();

                //Generar pago
                $pago = new \App\Pago;
                $pago->monto=$recibos[$i]->abono;
                $pago->mes=$recibos[$i]->item->mes;
                $pago->anio=$recibos[$i]->item->anio;
                $pago->sucursal_id=$recibos[$i]->item->sucursal_id;
                $pago->cliente_id=$recibos[$i]->item->cliente_id;
                $pago->doc_cancelador_id=$docCancelador->id;
                $pago->save();
            }
            //El cliente pago completo
            else if ($recibos[$i]->abono >= $recibos[$i]->importe) {

                //Cargar cliente
                $cliente = \App\Cliente::find($recibos[$i]->item->cliente_id);

                //Borrar deudas anteriores si las tiene
                $deudas = $cliente->deudas;    
                if (count($deudas)>0) {
                    for ($k=0; $k < count($deudas); $k++) { 
                        $deudas[$k]->delete();
                    } 
                }

                /*if ($cliente->estado == 'M') {
                    $cliente->estado = 'V';
                    $cliente->save();
                }*/

                //Rendir recibo
                DB::table('recibos')
                    ->where('id', $recibos[$i]->item->id)
                    ->update(['estado' => 'R',
                        'abono' => $recibos[$i]->abono,
                        'rendicion_id' => $rendicion->id]);

                //Generar documento cancelador
                $docCancelador = new \App\DocCancelador;
                $docCancelador->estado='P';
                $docCancelador->sucursal_id=$recibos[$i]->item->sucursal_id;
                $docCancelador->recibo_id=$recibos[$i]->item->id;
                $docCancelador->rendicion_id=$rendicion->id;
                $docCancelador->save();

                //Generar pago
                $pago = new \App\Pago;
                $pago->monto=$recibos[$i]->abono;
                $pago->mes=$recibos[$i]->item->mes;
                $pago->anio=$recibos[$i]->item->anio;
                $pago->sucursal_id=$recibos[$i]->item->sucursal_id;
                $pago->cliente_id=$recibos[$i]->item->cliente_id;
                $pago->doc_cancelador_id=$docCancelador->id;
                $pago->save();
            }
        }

        return response()->json(['status'=>'ok', 'rendicion'=>$rendicion], 200);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
    public function update(Request $request, $rendicion_id)
    {
        //Comprobamos si la rendicion que nos están pasando existe o no.
        $rendicion=\App\Rendicion::with('recibos.cliente')
                ->with('docsCanceladores')
                ->find($rendicion_id);

        if(count($rendicion)==0){
            return response()->json(['error'=>'No existe la rendicion con id '.$rendicion_id], 404);          
        }

        set_time_limit(300);

        //Aprobar rendicion
        $rendicion->estado = 'A';
        $rendicion->autorizante_id = $request->input('autorizante_id');
        $rendicion->f_autorizacion = date('Y-m-d H:i:s');
        $rendicion->save();

        //Aprobar recibos relacionados con la rendicion
        for ($i=0; $i < count($rendicion->recibos); $i++) { 
            $rendicion->recibos[$i]->estado = 'A';
            $rendicion->recibos[$i]->save();

            //Si el cliente estaba moroso(M) y abono el total adeudado se pasa a vigente(V)
            /*if ($rendicion->recibos[$i]->cliente->estado == 'M' &&
             $rendicion->recibos[$i]->abono >= $rendicion->recibos[$i]->importe) {
                $rendicion->recibos[$i]->cliente->estado = 'V';
                $rendicion->recibos[$i]->cliente->save();
            }*/

            //Si el cliente estaba moroso(M) 
            if ($rendicion->recibos[$i]->cliente->estado == 'M') {

                //verificar si todavia tiene recibos por pagar
                $recibosPendientes = \App\Recibo::where('cliente_id',$rendicion->recibos[$i]->cliente->id)
                ->where('estado', '<>', 'A')
                ->get();

                //Si no tiene recibos pendientes se pasa a vigente (V)
                if (sizeof($recibosPendientes) == 0) {
                    $rendicion->recibos[$i]->cliente->estado = 'V';
                    $rendicion->recibos[$i]->cliente->save();
                }
            }
        }

        //Aprobar los documentos canceladores relacionados con la rendicion
        /*for ($j=0; $j < count($rendicion->docs_canceladores); $j++) { 
            $rendicion->docs_canceladores[$j]->estado = 'A';
            $rendicion->docs_canceladores[$j]->save();
        }*/
        DB::table('docs_canceladores')
            ->where('rendicion_id', $rendicion->id)
            ->update(['estado' => 'A']);




        return response()->json(['status'=>'ok', 'rendicion'=>$rendicion], 200);
        
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
