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
    public function index()
    {
        //
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

        //Verificar si ya estan generados los recibos de la cartera_id para el mes actual
        $yaGenerados = DB::select("SELECT MAX(id) as idMax FROM recibos
                 WHERE mes = MONTH(now())
                 AND anio = YEAR(now())
                 AND cartera_id = ".$cartera_id);
        $yaGenerados = $yaGenerados[0]->idMax;
        if ($yaGenerados) {
            // Devolvemos un código 409 Conflict.
            return response()->json(['error'=>'Los recibos de esta cartera ya fuerón generados.'], 409);
        }

        /*//Cargar los tickets de la cartera que estan asignados a clientes
        $tickets = \App\TicketCartera::where('cartera_id', $cartera_id)->
                whereNotNull('cliente_id')->get();
        if(count($tickets)==0){ 
            return response()->json(['error'=>'La cartera no tiene tickets asignados a clientes.'], 404);
        }*/

        //Cargar los clientes que pertenecen a la cartera
        //y que no esten dados de baja
        $clientes = \App\Cliente::where('cartera_id', $cartera_id)
                ->where('estado', '<>', 'B')->get();
        if(count($clientes)==0){ 
            return response()->json(['error'=>'La cartera no contiene clientes ó todos fuerón dados de baja.'], 404);
        }

        $recibosGenerados = 0;

        //Recorrer los clentes y buscar su ultimo pago.
        for ($i=0; $i < count($clientes); $i++) { 

            $idMax = DB::select("SELECT max(id) as idMax FROM `pagos` WHERE cliente_id = ".$clientes[$i]->id);

            $ultimoPago = \App\Pago::where('id', $idMax[0]->idMax)->get();

            //Si tiene ultimo pago, calcular el periodo de tiempo
            //en meses con respecto al mes actual
            if (sizeof($ultimoPago) > 0) {
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

                //Si tiene mas de tres meses que no paga, se pasa a estado moroso
                if($mesesDeuda > 3 ){
                    $clientes[$i]->estado = 'M';
                    $clientes[$i]->ano_moroso = $ultimoPago[0]->anio;
                    $clientes[$i]->mes_moroso = $ultimoPago[0]->mes;
                    $cliente[$i]->save();
                }

                //Si debe un mes o mas, se hace el calculo de lo que debe
                if($mesesDeuda > 0 ){
                    //Si el cliente es afiliado cueto independiente (AF_CUETO_S)
                    if ($clientes[$i]->tipo == 'AF_CUETO_S') {
                        //Calcular la edad del cliente
                        $f_nacimiento = new DateTime($clientes[$i]->f_nacimiento);
                        $interval = $f_nacimiento->diff($fechaActual);

                        $edadActual = $interval->y;

                        //$clientes[$i]->edadActual = $edadActual;

                        //Cargar la tarifa correspondiente a la edad actual
                        $tarifa = \App\TarifaCuetoSola::where('edad_min', '<=', $edadActual)
                            ->where('edad_max', '>=', $edadActual)->get();

                        //$clientes[$i]->tarifa = $tarifa[0];

                        //Calcular el importe (total)
                        $importeTotal = $tarifa[0]->tarifa * $mesesDeuda; 
                        //$clientes[$i]->importeTotal = $importeTotal;

                        //Preparar el detalle del recibo
                        $detalle = [
                            [
                            'id_persona' => $clientes[$i]->id,
                            'edad' => $edadActual,
                            'importeParcial' => $importeTotal
                            ]
                        ];

                        //Consultar el id del ultimo recibo para setear num_recibo de forma secuencial
                        $ultimoRecibo = DB::select("SELECT MAX(id) as idMax FROM recibos");
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

                        //$clientes[$i]->edadActual = $edadActual;

                        //Cargar la tarifa correspondiente a la edad actual
                        $tarifa = \App\TarifaCueto::where('edad_min', '<=', $edadActual)
                            ->where('edad_max', '>=', $edadActual)->get();

                        //$clientes[$i]->tarifa = $tarifa[0];

                        //Calcular el importe (parcial)
                        $importeParcial = $tarifa[0]->tarifa * $mesesDeuda; 
                        //$clientes[$i]->importeParcial = $importeParcial;

                        //Preparar el detalle del recibo
                        $detalle = [
                            [
                            'id_persona' => $clientes[$i]->id,
                            'edad' => $edadActual,
                            'importeParcial' => $importeParcial
                            ]
                        ];

                        $importeTotal = $importeParcial;

                        //Cargar los familiares del cliente titular
                        $familiares = $clientes[$i]->familiares;
                        $clientes[$i]->familiares = $familiares;

                        //Recorrer los familiares y calcular el importe parcial
                        for ($j=0; $j < count($familiares) ; $j++) { 
                            //Calcular la edad del familiar
                            $f_nacimiento = new DateTime($familiares[$j]->f_nacimiento);
                            $interval = $f_nacimiento->diff($fechaActual);

                            $edadActual = $interval->y;

                            //$familiares[$j]->edadActual = $edadActual;

                            //Cargar la tarifa correspondiente a la edad actual
                            $tarifa = \App\TarifaCueto::where('edad_min', '<=', $edadActual)
                                ->where('edad_max', '>=', $edadActual)->get();

                            //$familiares[$j]->tarifa = $tarifa[0];

                            //Calcular el importe (parcial)
                            $importeParcial = $tarifa[0]->tarifa * $mesesDeuda; 
                            //$familiares[$j]->importeParcial = $importeParcial;

                            //Preparar el detalle del recibo
                            array_push($detalle, ['id_persona' => $familiares[$j]->id,
                                                'edad' => $edadActual,
                                                'importeParcial' => $importeParcial]);

                            $importeTotal = $importeTotal + $importeParcial;
                        }

                        //Consultar el id del ultimo recibo para setear num_recibo de forma secuencial
                        $ultimoRecibo = DB::select("SELECT MAX(id) as idMax FROM recibos");
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
        //
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
    public function recibosCartera($cartera_id)
    {
        //Comprobamos si la cartera que nos están pasando existe o no.
        $cartera=\App\Cartera::find($cartera_id);

        if(count($cartera)==0){
            return response()->json(['error'=>'No existe la cartera con id '.$cartera_id], 404);          
        }

        //Cargar los recibos
        $recibos=\App\Recibo::with('cliente')
            ->where('cartera_id',$cartera_id)
            ->where('mes',DB::raw('MONTH(now())'))
            ->where('anio',DB::raw('YEAR(now())'))
            ->get();

        if(count($recibos) == 0){
            return response()->json(['error'=>'Los recibos de esta cartera no han sido generados.'], 404);          
        }else{

            for ($i=0; $i < count($recibos); $i++) { 
                $recibos[$i]->detalle = json_decode($recibos[$i]->detalle);

                if ($recibos[$i]->cliente->tipo == 'AF_CUETO') {
                    $recibos[$i]->cliente->familiares = $recibos[$i]->cliente->familiares;
                }
            }

            return response()->json(['status'=>'ok', 'cartera'=>$cartera, 'recibos'=>$recibos], 200);
        }


    }
}
