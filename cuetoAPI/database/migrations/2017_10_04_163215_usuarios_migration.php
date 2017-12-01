<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UsuariosMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user')->unique();
            $table->string('password', 60);
            $table->string('correo')->unique();
            $table->string('rol');// SU=super-usuario, ADMIN=administrador, G=gerente, A=administrartivo, VC=vendedor/cobrador
            $table->string('nombre');
            $table->string('apellido');
            $table->string('telefono');

            $table->integer('sucursal_id')->unsigned()->nullable();
            $table->foreign('sucursal_id')->references('id')->on('sucursales');

            /*$table->integer('cartera_id')->unsigned()->nullable();
            $table->foreign('cartera_id')->references('id')->on('carteras');*/
            
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
        Schema::drop('usuarios');
    }
}
