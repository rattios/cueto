<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'sucursales';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['nombre', 'direccion', 'telefono', 'correo'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function usuarios()
    {
        // 1 sucursal tiene muchos usuarios
        return $this->hasMany('App\User', 'sucursal_id');
    }

    public function clientes()
    {
        // 1 sucursal tiene muchos clientes
        return $this->hasMany('App\Cliente', 'sucursal_id');
    }

    public function carteras()
    {
        // 1 sucursal tiene muchas carteras de clientes
        return $this->hasMany('App\Cartera', 'sucursal_id');
    }

    public function convenios()
    {
        // 1 sucursal tiene muchos convenios
        return $this->hasMany('App\Convenio', 'sucursal_id');
    }

    public function pagos()
    {
        // 1 sucursal tiene muchos pagos
        return $this->hasMany('App\Pago', 'sucursal_id');
    }

    public function contratos()
    {
        // 1 sucursal tiene muchos contratos
        return $this->hasMany('App\Contrato', 'sucursal_id');
    }

    public function empleados()
    {
        // 1 sucursal tiene muchos empleados de titulares de convenios
        return $this->hasMany('App\Empleado', 'sucursal_id');
    }

    public function familiares()
    {
        // 1 sucursal tiene muchos familiares de titulares
        return $this->hasMany('App\Empleado', 'sucursal_id');
    }

    public function rendiciones()
    {
        // 1 sucursal tiene muchas rendiciones
        return $this->hasMany('App\Rendicion', 'sucursal_id');
    }

    public function recibos()
    {
        // 1 sucursal tiene muchos recibos
        return $this->hasMany('App\Recibo', 'sucursal_id');
    }

    public function docsCanceladores()
    {
        // 1 sucursal tiene muchos documentos canceladores de recibos
        return $this->hasMany('App\DocCancelador', 'sucursal_id');
    }

}
