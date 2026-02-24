<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'subtital',
        'tax',
        'total',
        'delivery_addres',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'subtotal'=>'decimal:2',
            'tax'=>'decimal:2',
            'tatotal'=>'decimal:2',
        ];
    }
    // Auto Generated Order Number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order){
            $order->order_number = 'ORD-' . strtoupper(Str::random(8));
        });
    }

    // Relasi Ke User
    public function user(){
        return $this->belongsTo(User::class);
    }

    // Relasi Ke Order Items
    public function orderItems(){
        return $this->hasMany(OrderItem::class);
    }

    // Relasi Ke Payment
    public function payment(){
        return $this->hasOne(Payment::class);
    }
}
