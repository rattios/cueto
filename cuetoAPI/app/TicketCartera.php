<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TicketCartera extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'tickets_cartera';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['ticket', 'cartera_id', 'cliente_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function cartera()
    {
        // 1 ticket pertenece a una cartera
        return $this->belongsTo('App\Cartera', 'cartera_id');
    }

    public function cliente()
    {
        // 1 ticket pertenece a un cliente
        return $this->belongsTo('App\Cliente', 'cliente_id');
    }

    
}
