<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recibo extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'recibos';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['num_recibo', 'importe', 'estado',
            'mes', 'anio', 'sucursal_id',
            'convenio_id', 'cartera_id', 'cliente_id', 
            'rendicion_id', 'detalle'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function sucursal()
    {
        // 1 recibo pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function cliente()
    {
        // 1 recibo pertene a un cliente
        return $this->belongsTo('App\Cliente', 'cliente_id');
    }

    public function rendicion()
    {
        // 1 recibo pertene a una rendicion
        return $this->belongsTo('App\Rendicion', 'rendicion_id');
    }

    public function docCancelador()
    {
        // 1 recibo tiene un documento cancelador
        return $this->hasOne('App\DocCancelador', 'recibo_id');
    }

}
