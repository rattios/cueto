<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contrato extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'contratos';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['num_contrato', 'num_documento', 'ruta_documento',
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
        // 1 contrato pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function cliente()
    {
        // 1 contrato pertene a un cliente
        return $this->belongsTo('App\Cliente', 'cliente_id');
    }
}
