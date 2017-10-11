<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RecibosMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recibos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('num_recibo')->unique();
            $table->integer('importe');
            $table->string('estado'); //emitido ...
            $table->integer('mes');
            $table->integer('anio');
            //$table->string('empresa')->nullable(); //en caso de ser convenio

            $table->integer('sucursal_id')->unsigned();
            $table->foreign('sucursal_id')->references('id')->on('sucursales');

            $table->integer('convenio_id')->unsigned()->nullable(); //en caso de ser cliente_convenio
            $table->foreign('convenio_id')->references('id')->on('convenios');

            $table->integer('cartera_id')->unsigned()->nullable(); //en caso de ser cliene_cueto
            $table->foreign('cartera_id')->references('id')->on('carteras');

            $table->integer('cliente_id')->unsigned();
            $table->foreign('cliente_id')->references('id')->on('clientes');

            $table->integer('rendicion_id')->unsigned()->nullable();
            $table->foreign('rendicion_id')->references('id')->on('rendiciones');

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
        Schema::drop('recibos');
    }
}
