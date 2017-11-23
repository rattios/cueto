<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ConveniosMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('convenios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('estado'); //activo(vigente), inactivo(no vigente)
            $table->string('empresa');
            $table->string('direccion');
            $table->string('telefono');
            $table->string('correo');

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
        Schema::drop('convenios');
    }
}
