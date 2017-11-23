<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RendicionesMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rendiciones', function (Blueprint $table) {
            $table->increments('id');
            $table->string('estado'); //pendiente, confirmado

            $table->integer('sucursal_id')->unsigned();
            $table->foreign('sucursal_id')->references('id')->on('sucursales');

            $table->integer('cartera_id')->unsigned();
            $table->foreign('cartera_id')->references('id')->on('carteras');

            $table->integer('cobrador_id')->unsigned();
            $table->foreign('cobrador_id')->references('id')->on('usuarios');

            $table->integer('autorizante_id')->unsigned()->nullable();
            $table->foreign('autorizante_id')->references('id')->on('usuarios');

            $table->dateTime('f_autorizacion')->nullable();

            $table->timestamps();//fecha de rendicion
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('rendiciones');
    }
}
