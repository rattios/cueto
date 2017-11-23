<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract,
                                    AuthorizableContract,
                                    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;
        /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'usuarios';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user', 'password', 'correo', 'rol',
     'nombre', 'apellido', 'telefono', 'sucursal_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = [];

    //Relaciones
    public function sucursal()
    {
        // 1 usuario(rol != superUsuario && rol != Adiminstrador) pertene a una sucursal
        return $this->belongsTo('App\Sucursal', 'sucursal_id');
    }

    public function carteras()
    {
        // 1 usuario(rol == Vendedor/Cobrador) tiene muchas cateras de clientes
        return $this->hasMany('App\Cartera', 'vendedor_id');
    }

    public function rendiciones()
    {
        // 1 usuario(rol == Vendedor/Cobrador) hace muchas rendiciones
        return $this->hasMany('App\Rendicion', 'cobrador_id');
    }

    public function autorizaciones()
    {
        // 1 usuario(rol != Vendedor/Cobrador) autoriza muchas rendiciones
        return $this->hasMany('App\Rendicion', 'autorizante_id');
    }

    public function clientesCreados()
    {
        // 1 usuario tiene muchos clientes creados
        return $this->hasMany('App\Cliente', 'user_id');
    }
}
