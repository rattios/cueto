<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DocsCanceladoresMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('docs_canceladores', function (Blueprint $table) {
            $table->increments('id');
            $table->string('estado'); //pendiente, confirmado

            $table->integer('sucursal_id')->unsigned();
            $table->foreign('sucursal_id')->references('id')->on('sucursales');

            $table->integer('recibo_id')->unsigned();
            $table->foreign('recibo_id')->references('id')->on('recibos');

            $table->integer('rendicion_id')->unsigned();
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
        Schema::drop('docs_canceladores');
    }
}
