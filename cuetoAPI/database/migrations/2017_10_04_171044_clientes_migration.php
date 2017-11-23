<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ClientesMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tipo'); //AF_CUETO = afiliado cueto con grupo familiar,
                                    //AF_CUETO_S = afiliado cueto solo(independiente),
                                    //AF_CONV = afiliado convenio con grupo familiar,
                                    //AF_CONV_S = afiliado convenio solo(independiente).
            $table->string('nombre_1');
            $table->string('nombre_2')->nullable();
            $table->string('apellido_1');
            $table->string('apellido_2')->nullable();
            $table->string('dni')->unique();
            $table->string('direccion');
            $table->date('f_nacimiento'); //formato aaaa-mm-dd
            $table->string('estado'); //P=pendiente, N=normal, M=moroso, B=baja
            $table->string('sexo'); //M=masculino, F=femenino
            $table->float('cuota')->nullable(); //Cuota de ingreso
            $table->date('f_moroso')->nullable(); //Fecha desde que esta moroso


            $table->integer('sucursal_id')->unsigned();
            $table->foreign('sucursal_id')->references('id')->on('sucursales');

            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('usuarios');

            $table->integer('cartera_id')->unsigned()->nullable();
            $table->foreign('cartera_id')->references('id')->on('carteras');

            $table->integer('convenio_id')->unsigned()->nullable();
            $table->foreign('convenio_id')->references('id')->on('convenios');

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
        Schema::drop('clientes');
    }
}
