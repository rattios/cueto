<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TarifasCuetoMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*Tabla de tarifas para clientes particulares (cliente_cueto) con grupo familiar*/
        Schema::create('tarifasCueto', function (Blueprint $table) {
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
        Schema::drop('tarifasCueto');
    }
}
