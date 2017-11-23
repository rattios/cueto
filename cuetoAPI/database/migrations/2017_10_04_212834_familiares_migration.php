<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FamiliaresMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('familiares', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre_1');
            $table->string('nombre_2')->nullable();
            $table->string('apellido_1');
            $table->string('apellido_2')->nullable();
            $table->string('dni')->unique();
            $table->string('direccion');
            $table->date('f_nacimiento'); //formato aaaa-mm-dd
            $table->string('sexo'); //M=masculino, F=femenino
            $table->string('vinculo');
            $table->string('observaciones')->nullable();

            $table->integer('sucursal_id')->unsigned();
            $table->foreign('sucursal_id')->references('id')->on('sucursales');

            $table->integer('cliente_id')->unsigned()->nullable();//En caso de ser de AF_CUETO
            $table->foreign('cliente_id')->references('id')->on('clientes');

            $table->integer('empleado_id')->unsigned()->nullable();//En caso de ser de AF_CONV
            $table->foreign('empleado_id')->references('id')->on('empleados');

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
        Schema::drop('familiares');
    }
}
