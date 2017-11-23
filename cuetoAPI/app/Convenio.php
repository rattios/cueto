<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Convenio extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'convenios';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['estado', 'empresa', 'direccion',
    		'telefono', 'correo', 'sucursal_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function sucursal()
    {
        // 1 convenio pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function titular()
    {
        // 1 convenio tiene un cliente titular
        return $this->hasOne('App\Cliente', 'convenio_id');
    }
}
