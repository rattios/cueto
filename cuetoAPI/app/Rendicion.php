<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rendicion extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'rendiciones';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['estado', 'sucursal_id', 'cartera_id',
    		'cobrador_id', 'autorizante_id', 'f_autorizacion'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function sucursal()
    {
        // 1 rendicion pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function cartera()
    {
        // 1 rendicion pertene a una cartera de un cobrador
        return $this->belongsTo('App\Cartera', 'cartera_id');
    }

    public function cobrador()
    {
        // 1 rendicion pertene a un cobrador
        return $this->belongsTo('App\User', 'cobrador_id');
    }

    public function autorizante()
    {
        // 1 rendicion es autorizada por un usuario
        return $this->belongsTo('App\User', 'autorizante_id');
    }

    public function recibos()
    {
        // 1 rendicion tiene asociada muchos recibos
        return $this->hasMany('App\Recibo', 'rendicion_id');
    }

    public function docsCanceladores()
    {
        // 1 rendicion genera muchos documentos canceladores
        return $this->hasMany('App\DocCancelador', 'rendicion_id');
    }

    
}
