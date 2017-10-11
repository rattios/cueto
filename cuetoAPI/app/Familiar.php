<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Familiar extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'familiares';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['nombre_1', 'nombre_2', 'apellido_1',
    		'apellido_2', 'dni', 'direccion',
    		'f_nacimineto', 'sexo', 'vinculo',
    		'observaciones', 'sucursal_id', 'cliente_id',
    		'empleado_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function sucursal()
    {
        // 1 familiar de un titular cliente_cueto pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function titular()
    {
        // 1 familiar tiene un titular, en caso de ser cliente_cueto el titular
        return $this->belongsTo('App\Cliente', 'cliente_id');
    }

    public function empleadoTitular()
    {
        // 1 familiar tiene un empleadotitular, en caso de ser un convenio
        return $this->belongsTo('App\Empleado', 'empleado_id');
    }
}
