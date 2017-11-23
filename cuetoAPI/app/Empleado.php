<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'empleados';

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
    		'f_nacimiento', 'sexo', 'observaciones',
    		'sucursal_id', 'cliente_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function sucursal()
    {
        // 1 empleado de un titular cliente_convenio pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function titular()
    {
        // 1 empleado tiene un titular
        return $this->belongsTo('App\Cliente', 'cliente_id');
    }

    public function familiares()
    {
        // 1 empleado tiene muchos familiares
        return $this->hasMany('App\Familiar', 'empleado_id');
    }
}
