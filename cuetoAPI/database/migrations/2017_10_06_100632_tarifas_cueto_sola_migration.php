<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TarifasCuetoSolaMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*Tabla de tarifas para clientes particulares independientes (cliente_cueto_solo) sin grupo familiar*/
        Schema::create('tarifasCuetoSola', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('edad_min'); //edad minima en años
            $table->integer('edad_max'); //edad maxima en años
            $table->float('tarifa');
            $table->integer('carencia'); //carencia en meses
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('tarifasCuetoSola');
    }
}
