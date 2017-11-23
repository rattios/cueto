<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TicketsCarteraMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tickets_cartera', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('ticket'); //numero de ticket

            $table->integer('cartera_id')->unsigned();
            $table->foreign('cartera_id')->references('id')->on('carteras');

            $table->integer('cliente_id')->unsigned()->nullable();
            $table->foreign('cliente_id')->references('id')->on('clientes');


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
        Schema::drop('tickes_cartera');
    }
}
