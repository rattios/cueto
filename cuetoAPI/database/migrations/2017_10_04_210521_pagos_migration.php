<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PagosMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->increments('id');
            $table->float('monto');
            $table->integer('mes');
            $table->integer('anio');

            $table->integer('sucursal_id')->unsigned();
            $table->foreign('sucursal_id')->references('id')->on('sucursales');

            $table->integer('cliente_id')->unsigned();
            $table->foreign('cliente_id')->references('id')->on('clientes');

            $table->integer('doc_cancelador_id')->unsigned();
            $table->foreign('doc_cancelador_id')->references('id')->on('docs_canceladores');

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
        Schema::drop('pagos');
    }
}
