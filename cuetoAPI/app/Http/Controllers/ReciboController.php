<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use BD;
use Illuminate\Support\Facades\DB;
use DateTime;

class ReciboController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->input('estado')) {

            //Cargar los recibos 
            $recibos=\App\Recibo::with('cliente')
                ->get();

            if(count($recibos) == 0){
                return response()->json(['error'=>'No existen recibos.'], 404);          
            }else{

                for ($i=0; $i < count($recibos); $i++) { 
                    $recibos[$i]->detalle = json_decode($recibos[$i]->detalle);
                    $recibos[$i]->deuda = json_decode($recibos[$i]->deuda);

                    if ($recibos[$i]->cliente->tipo == 'AF_CUETO') {
                        $recibos[$i]->cliente->familiares = $recibos[$i]->cliente->familiares;
                    }

                    $recibos[$i]->cartera=\App\Cartera::find($recibos[$i]->cartera_id);
                }

                return response()->json(['status'=>'ok', 'recibos'=>$recibos], 200);
            }
        }
        else{
            //Cargar los recibos cun un estado especifico
            $recibos=\App\Recibo::with('cliente')
                ->where('estado',$request->input('estado'))
                ->get();

            if(count($recibos) == 0){
                return response()->json(['error'=>'No existen recibos con estado '.$request->input('estado')], 404);          
            }else{

                for ($i=0; $i < count($recibos); $i++) { 
                    $recibos[$i]->detalle = json_decode($recibos[$i]->detalle);
                    $recibos[$i]->deuda = json_decode($recibos[$i]->deuda);

                    if ($recibos[$i]->cliente->tipo == 'AF_CUETO') {
                        $recibos[$i]->cliente->familiares = $recibos[$i]->cliente->familiares;
                    }

                    $recibos[$i]->cartera=\App\Cartera::find($recibos[$i]->cartera_id);
                }

                return response()->json(['status'=>'ok', 'recibos'=>$recibos], 200);
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

    //Generar los recibos de cobro de una cartera
    public function store(Request $request, $cartera_id)
    {
        //Comprobamos si la cartera que nos están pasando existe o no.
        $cartera=\App\Cartera::find($cartera_id);

        if(count($cartera)==0){
            return response()->json(['error'=>'No existe la cartera con id '.$cartera_id], 404);          
        }

        //verificar si la cartera tiene rendiciones pendientes por aprobar
        $rendiciones = \App\Rendicion::where('cartera_id', $cartera->id)
                ->where('estado', 'P')->get();
        if(count($rendiciones)>0){ 
            // Devolvemos un código 409 Conflict.
            return response()->json(['error'=>'La cartera contiene rendiciones por aprobar. Apruebe las rendiciones y luego genere los recibos'], 409);
        }

        //Verificar si ya estan generados los recibos de la cartera_id para el mes actual
        /*$yaGenerados = DB::select("SELECT MAX(id) as idMax FROM recibos
                 WHERE mes = MONTH(now())
                 AND anio = YEAR(now())
                 AND cartera_id = ".$cartera_id);
        $yaGenerados = $yaGenerados[0]->idMax;
        if ($yaGenerados) {
            // Devolvemos un código 409 Conflict.
            return response()->json(['error'=>'Los recibos de esta cartera ya fuerón generados.'], 409);
        }*/

        //Cargar los clientes que pertenecen a la cartera
        //y que no esten dados de baja
        $clientes = \App\Cliente::where('cartera_id', $cartera_id)
                ->where('estado', '<>', 'B')->get();
        if(count($clientes)==0){ 
            return response()->json(['error'=>'La cartera no contiene clientes ó todos fuerón dados de baja.'], 404);
        }

        set_time_limit(300);

        $recibosGenerados = 0; 

        //Recorrer los clientes y buscar su ultimo pago.
        for ($i=0; $i < count($clientes); $i++) { 

            $idMax = DB::select("SELECT max(id) as idMax FROM `pagos` WHERE cliente_id = ".$clientes[$i]->id);

            $ultimoPago = \App\Pago::where('id', $idMax[0]->idMax)->get();

            //verificar que el cliente no tenga el recibo generado para el mes actual
            $reciboCliente = \App\Recibo::where('cliente_id',$clientes[$i]->id)
                ->where('mes',DB::raw('MONTH(now())'))
                ->where('anio',DB::raw('YEAR(now())'))
                ->get();

            //Si tiene ultimo pago y no tiene el recibo generado para el mes actual,
            //calcular el periodo de tiempo
            //en meses con respecto al mes actual
            if (sizeof($ultimoPago) > 0 && sizeof($reciboCliente) == 0) {

                //verificar si el cliente ya tenia recibos aneriores sin pagar o rendir
                //autorendirlos y agregarlos como deuda
                $recibosPendientes = \App\Recibo::where('cliente_id',$clientes[$i]->id)
                ->where('estado', '<>', 'A')
                ->where('estado', '<>', 'RS')
                ->get();

                if (count($recibosPendientes)>0) {
                    for ($l=0; $l < count($recibosPendientes) ; $l++) { 
                        //Autorendir
                        $recibosPendientes[$l]->estado = 'RS';
                        $recibosPendientes[$l]->save();

                        //Extraer el total de los importes parciales
                        //Nota: las deudas que pudiera tener el cliente no se toman 
                        //en cuenta para no sobreescribirlas
                        $detalleAux = json_decode($recibosPendientes[$l]->detalle);
                        $montoAux = 0;
                        for ($m=0; $m < count($detalleAux); $m++) { 
                            $montoAux = $montoAux + $detalleAux[$m]->importeParcial;
                        }

                        //Generar deuda
                        $nuevaDeuda = new \App\Deuda;
                        $nuevaDeuda->monto=$montoAux;
                        $nuevaDeuda->mes=$recibosPendientes[$l]->mes;
                        $nuevaDeuda->anio=$recibosPendientes[$l]->anio;
                        $nuevaDeuda->sucursal_id=$recibosPendientes[$l]->sucursal_id;
                        $nuevaDeuda->cliente_id=$recibosPendientes[$l]->cliente_id;
                        $nuevaDeuda->recibo_id=$recibosPendientes[$l]->id;
                        $nuevaDeuda->save();
                    }
                }

                //Calcular los meses que debe
                $fechaActual = new DateTime("now");
                //$fechaActual = new DateTime('2017-11-21');
                $anioActual = date("Y");
                $mesActual = date("m");
                $diaActual = date("d");
                $f_ultimoPago = new DateTime($ultimoPago[0]->anio.'-'.$ultimoPago[0]->mes.'-'.$diaActual);
                $interval = $f_ultimoPago->diff($fechaActual);

                /*$yearsDiff = $interval->format('%y'); 
                $monthsDiff = $interval->format('%m');
                $clientes[$i]->yearsDiff = $yearsDiff;
                $clientes[$i]->monthsDiff = $monthsDiff;*/

                $mesesDeuda = $interval->m + $interval->y * 12;

                //$clientes[$i]->mesesDeuda = $mesesDeuda;

                //Si tiene mas de un mes que no paga, se pasa a estado moroso
                if($mesesDeuda > 1 ){
                    $clientes[$i]->estado = 'M';
                    $clientes[$i]->ano_moroso = $ultimoPago[0]->anio;
                    $clientes[$i]->mes_moroso = $ultimoPago[0]->mes;
                    $clientes[$i]->save();
                }

                //Si debe un mes o mas, se hace el calculo de lo que debe
                if($mesesDeuda > 0 ){
                    //Si el cliente es afiliado cueto independiente (AF_CUETO_S)
                    if ($clientes[$i]->tipo == 'AF_CUETO_S') {
                        //Calcular la edad del cliente
                        $f_nacimiento = new DateTime($clientes[$i]->f_nacimiento);
                        $interval = $f_nacimiento->diff($fechaActual);

                        $edadActual = $interval->y;

                        if ($edadActual == 0) {
                            $edadActualAux = 1;
                        }else if($edadActual > 125){
                            $edadActualAux = 125;
                        }else{
                            $edadActualAux = $edadActual;
                        }

                        //$clientes[$i]->edadActual = $edadActual;

                        //Cargar la tarifa correspondiente a la edad actual
                        $tarifa = \App\TarifaCuetoSola::where('edad_min', '<=', $edadActualAux)
                            ->where('edad_max', '>=', $edadActualAux)->get();

                        //$clientes[$i]->tarifa = $tarifa[0];

                        //Cargar las deudas de meses anteriores
                        $deudas = $clientes[$i]->deudas;    
                        //$clientes[$i]->deudas = $clientes[$i]->deudas;

                        //Calcular el importe (total)
                        if (count($deudas)>0) {
                            $importeParcial = $tarifa[0]->tarifa;
                            $importeTotal = 0;
                            for ($k=0; $k < count($deudas); $k++) { 
                                 $importeTotal = $importeTotal + $deudas[$k]->monto;
                             } 
                             $importeTotal = $importeParcial + $importeTotal;
                             //$clientes[$i]->importeTotal = $importeTotal;
                        }else{
                            $importeParcial = $tarifa[0]->tarifa * $mesesDeuda; 
                            //$clientes[$i]->importeTotal = $importeTotal;
                            $importeTotal = $importeParcial;
                        }
                        

                        //Preparar el detalle del recibo
                        $detalle = [
                            [
                            'id_persona' => $clientes[$i]->id,
                            'edad' => $edadActual,
                            'importeParcial' => $importeParcial
                            ]
                        ];

                        //Consultar el id del ultimo recibo para setear num_recibo de forma secuencial
                        $ultimoRecibo = DB::select("SELECT MAX(num_recibo) as idMax FROM recibos");
                        $ultimoRecibo = $ultimoRecibo[0]->idMax;
                        if (!$ultimoRecibo) {
                            $ultimoRecibo = 0;
                        }

                        //Generar el recibo
                        $recibo = new \App\Recibo;
                        $recibo->num_recibo=$ultimoRecibo + 1;
                        $recibo->importe=$importeTotal;
                        $recibo->estado='E'; //E = emitido
                        $recibo->mes=$mesActual;
                        $recibo->anio=$anioActual;
                        $recibo->sucursal_id=$cartera->sucursal_id;
                        $recibo->cartera_id=$cartera->id;
                        $recibo->cliente_id=$clientes[$i]->id;
                        $recibo->detalle=json_encode($detalle);
                        //$recibo->detalle2=$detalle;
                        $recibo->deuda=json_encode($deudas);
                        //$recibo->deuda2=$deudas;
                        $recibo->save();
                        
                        //$clientes[$i]->recibo = $recibo;

                        $recibosGenerados = $recibosGenerados + 1;

                    }
                    //Si el cliente es afiliado cueto con grupo familiar (AF_CUETO)
                    else if ($clientes[$i]->tipo == 'AF_CUETO') {
                        //Calcular la edad del cliente titular
                        $f_nacimiento = new DateTime($clientes[$i]->f_nacimiento);
                        $interval = $f_nacimiento->diff($fechaActual);

                        $edadActual = $interval->y;

                        if ($edadActual == 0) {
                            $edadActualAux = 1;
                        }else if($edadActual > 125){
                            $edadActualAux = 125;
                        }else{
                            $edadActualAux = $edadActual;
                        }

                        //$clientes[$i]->edadActual = $edadActual;

                        //Cargar la tarifa correspondiente a la edad actual
                        $tarifa = \App\TarifaCueto::where('edad_min', '<=', $edadActualAux)
                            ->where('edad_max', '>=', $edadActualAux)->get();

                        //$clientes[$i]->tarifa = $tarifa[0];

                        //Cargar las deudas de meses anteriores
                        $deudas = $clientes[$i]->deudas;    
                        //$clientes[$i]->deudas = $clientes[$i]->deudas;

                        //Calcular el importe (parcial)
                        if (count($deudas)>0) {
                            $importeParcial = $tarifa[0]->tarifa;
                            $importeTotal = 0;
                            for ($k=0; $k < count($deudas); $k++) { 
                                 $importeTotal = $importeTotal + $deudas[$k]->monto;
                             } 
                             $importeTotal = $importeParcial + $importeTotal;
                        }else{
                            $importeParcial = $tarifa[0]->tarifa * $mesesDeuda; 
                            //$clientes[$i]->importeParcial = $importeParcial;

                            $importeTotal = $importeParcial;
                        }

                        //Preparar el detalle del recibo
                        $detalle = [
                            [
                            'id_persona' => $clientes[$i]->id,
                            'edad' => $edadActual,
                            'importeParcial' => $importeParcial
                            ]
                        ];

                        //Cargar los familiares del cliente titular
                        $familiares = $clientes[$i]->familiares;
                        //$clientes[$i]->familiares = $familiares;

                        //Recorrer los familiares y calcular el importe parcial
                        for ($j=0; $j < count($familiares) ; $j++) { 
                            //Calcular la edad del familiar
                            $f_nacimiento = new DateTime($familiares[$j]->f_nacimiento);
                            $interval = $f_nacimiento->diff($fechaActual);

                            $edadActual = $interval->y;

                            if ($edadActual == 0) {
                                $edadActualAux = 1;
                            }else if($edadActual > 125){
                                $edadActualAux = 125;
                            }else{
                                $edadActualAux = $edadActual;
                            }

                            //$familiares[$j]->edadActual = $edadActual;

                            //Cargar la tarifa correspondiente a la edad actual
                            $tarifa = \App\TarifaCueto::where('edad_min', '<=', $edadActualAux)
                                ->where('edad_max', '>=', $edadActualAux)->get();

                            //$familiares[$j]->tarifa = $tarifa[0];

                            //Calcular el importe (parcial)
                            if (count($deudas)>0) {
                                $importeParcial = $tarifa[0]->tarifa;
                            }else{
                                $importeParcial = $tarifa[0]->tarifa * $mesesDeuda; 
                                //$familiares[$j]->importeParcial = $importeParcial;
                            }
                            

                            //Preparar el detalle del recibo
                            array_push($detalle, ['id_persona' => $familiares[$j]->id,
                                                'edad' => $edadActual,
                                                'importeParcial' => $importeParcial]);

                            $importeTotal = $importeTotal + $importeParcial;
                        }

                        //Consultar el id del ultimo recibo para setear num_recibo de forma secuencial
                        $ultimoRecibo = DB::select("SELECT MAX(num_recibo) as idMax FROM recibos");
                        $ultimoRecibo = $ultimoRecibo[0]->idMax;
                        if (!$ultimoRecibo) {
                            $ultimoRecibo = 0;
                        }

                        //$clientes[$i]->importeTotal = $importeTotal;

                        //Generar el recibo
                        $recibo = new \App\Recibo;
                        $recibo->num_recibo=$ultimoRecibo + 1;
                        $recibo->importe=$importeTotal;
                        $recibo->estado='E'; //E = emitido
                        $recibo->mes=$mesActual;
                        $recibo->anio=$anioActual;
                        $recibo->sucursal_id=$cartera->sucursal_id;
                        $recibo->cartera_id=$cartera->id;
                        $recibo->cliente_id=$clientes[$i]->id;
                        $recibo->detalle=json_encode($detalle);
                        //$recibo->detalle2=$detalle;
                        $recibo->deuda=json_encode($deudas);
                        //$recibo->deuda2=$deudas;
                        $recibo->save();
                        
                        //$clientes[$i]->recibo = $recibo;

                        $recibosGenerados = $recibosGenerados + 1;

                    }
                }
            }

            //$clientes[$i]->ultimoPago = $ultimoPago;

        }

        //return response()->json(['clientes'=>$clientes], 200);
        return response()->json(['recibosGenerados'=>$recibosGenerados], 200);
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
    public function update(Request $request, $id)
    {

        $recibos=\App\Recibo::find($id);
        
        $recibos->estado=$request->input('estado');
        //return $recibos;
        if ($recibos->save()) {
            return response()->json(['status'=>'ok','recibos'=>$recibos], 200);
        }else{
            return response()->json(['error'=>'No se pudo actualizar '.$cartera_id], 404); 
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

    //retorna los recibos de la cartera_id
    public function recibosCartera(Request $request, $cartera_id)
    {
        //Comprobamos si la cartera que nos están pasando existe o no.
        $cartera=\App\Cartera::find($cartera_id);

        if(count($cartera)==0){
            return response()->json(['error'=>'No existe la cartera con id '.$cartera_id], 404);          
        }

        if (!$request->input('estado')) {

            //Cargar los recibos del mes actual
            $recibos=\App\Recibo::with('cliente')
                ->where('cartera_id',$cartera_id)
                ->where('mes',DB::raw('MONTH(now())'))
                ->where('anio',DB::raw('YEAR(now())'))
                ->get();

            if(count($recibos) == 0){
                return response()->json(['error'=>'No existen recibos asociados a la cartera.'], 404);          
            }else{

                for ($i=0; $i < count($recibos); $i++) { 
                    $recibos[$i]->detalle = json_decode($recibos[$i]->detalle);
                    $recibos[$i]->deuda = json_decode($recibos[$i]->deuda);

                    if ($recibos[$i]->cliente->tipo == 'AF_CUETO') {
                        $recibos[$i]->cliente->familiares = $recibos[$i]->cliente->familiares;
                    }
                }

                return response()->json(['status'=>'ok', 'cartera'=>$cartera, 'recibos'=>$recibos], 200);
            }
        }
        else{
            //Cargar los recibos del mes actual cun un estado especifico
            $recibos=\App\Recibo::with('cliente')
                ->where('mes',DB::raw('MONTH(now())'))
                ->where('anio',DB::raw('YEAR(now())'))
                ->where('estado',$request->input('estado'))
                ->where('cartera_id',$cartera_id)
                ->get();

            if(count($recibos) == 0){
                return response()->json(['error'=>'No existen recibos con estado '.$request->input('estado').' en la cartera con id '.$cartera_id], 404);          
            }else{

                for ($i=0; $i < count($recibos); $i++) { 
                    $recibos[$i]->detalle = json_decode($recibos[$i]->detalle);
                    $recibos[$i]->deuda = json_decode($recibos[$i]->deuda);

                    if ($recibos[$i]->cliente->tipo == 'AF_CUETO') {
                        $recibos[$i]->cliente->familiares = $recibos[$i]->cliente->familiares;
                    }
                }

                return response()->json(['status'=>'ok', 'cartera'=>$cartera, 'recibos'=>$recibos], 200);
            }
        }


    }
}
