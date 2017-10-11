<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TarifasConvenioSolaMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*Tabla de tarifas para clientes de convenio (cliente_convenio_solo) sin grupo familiar*/
        Schema::create('tarifasConvenioSola', function (Blueprint $table) {
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
        Schema::drop('tarifasConvenioSola');
    }
}
