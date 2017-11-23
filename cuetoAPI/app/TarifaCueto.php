<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TarifaCueto extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'tarifascueto';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['id','edad_min', 'edad_max', 'tarifa', 'carencia'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];
}
