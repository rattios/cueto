<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DocCancelador extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'docs_canceladores';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['estado', 'sucursal_id', 'recibo_id', 'rendicion_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function sucursal()
    {
        // 1 documento cancelador pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function recibo()
    {
        // 1 documento cancelador pertene a un recibo
        return $this->belongsTo('App\Recibo', 'recibo_id');
    }

    public function rendicion()
    {
        // 1 documento cancelador es generado por una rendicion
        return $this->belongsTo('App\Rendicion', 'rendicion_id');
    }

    public function pagos()
    {
        // 1 docCancelador puede tener varios pagos
        return $this->hasMany('App\Pago', 'doc_cancelador_id');
    }
}
