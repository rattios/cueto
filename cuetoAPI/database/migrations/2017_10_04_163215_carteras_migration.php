<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CarterasMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carteras', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('numero');
            //$table->string('nombre');
            $table->string('descripcion')->nullable();

            //163834 usuarios
            //163215 carteras

            $table->integer('vendedor_id')->unsigned();
            $table->foreign('vendedor_id')->references('id')->on('usuarios');

            $table->integer('sucursal_id')->unsigned();
            $table->foreign('sucursal_id')->references('id')->on('sucursales');

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
        Schema::drop('carteras');
    }
}
