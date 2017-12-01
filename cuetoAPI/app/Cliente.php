<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'clientes';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['tipo', 'nombre_1', 'nombre_2',
    		'apellido_1', 'apellido_2', 'dni',
    		'direccion', 'f_nacimiento', 'estado',
    		'sexo', 'cuota', 'f_moroso', 'sucursal_id', 'sucursal', 'imagenes',
    		'user_id', 'cartera_id', 'convenio_id','f_alta', 'moroso', 'mes_moroso', 'ano_moroso','ticket','ticket_id', 'cartera','correo','telefono'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function sucursal()
    {
        // 1 cliente pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function creador()
    {
        // 1 cliente fue creado por un User
        return $this->belongsTo('App\User', 'user_id');
    }

    public function convenio()
    {
        // 1 cliente(tipo == AF_CONV) es el titular de un convenio
        return $this->belongsTo('App\Convenio', 'convenio_id');
    }

    public function cartera()
    {
        // 1 cliente(tipo == AF_CUETO) pertenece a una cartera
        return $this->belongsTo('App\Cartera', 'cartera_id');
    }

    public function ticket()
    {
        // 1 cliente tiene un ticket 
        return $this->hasOne('App\TicketCartera', 'cliente_id');
    }

    public function pagos()
    {
        // 1 cliente hace muchos pagos
        return $this->hasMany('App\Pago', 'cliente_id');
    }

    public function contrato()
    {
        // 1 cliente tiene un contrato
        return $this->hasOne('App\Contrato', 'cliente_id');
    }

    public function empleados()
    {
        // 1 cliente(tipo == AF_CONV) tiene muchos empleados
        return $this->hasMany('App\Empleado', 'cliente_id');
    }

    public function familiares()
    {
        // 1 cliente(tipo == AF_CUETO) tiene muchos familiares
        return $this->hasMany('App\Familiar', 'cliente_id');
    }

    public function recibos()
    {
        // 1 cliente tiene muchos recibos de cobro
        return $this->hasMany('App\Recibo', 'cliente_id');
    }

    public function deudas()
    {
        // 1 cliente puede tener varias deudas
        return $this->hasMany('App\Deuda', 'cliente_id');
    }
}
