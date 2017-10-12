<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cartera extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'carteras';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['numero', 'nombre', 'descripcion', 'sucursal_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function sucursal()
    {
        // 1 cartera pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function clientes()
    {
        // 1 cartera tiene muchos clientes
        return $this->hasMany('App\Cliente', 'cartera_id');
    }

    public function rendiciones()
    {
        // 1 cartera tiene muchas rendiciones de cobradores
        return $this->hasMany('App\Rendicion', 'cartera_id');
    }

    public function vendedor()
    {
        // 1 cartera pertenece a un usuario(rol == Vendedor/Cobrador) 
        return $this->hasOne('App\User', 'cartera_id');
    }

}
