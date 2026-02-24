<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'menu_item_id',
        'quantity',
        'unit_price',
        'subtotal',
        'notes'
    ];

    protected function casts(): array
    {
        return[
            'unit_price'=> 'decimal:2',
            'subtotal'=> 'decimal:2',
        ];
    }

    // Relasi Ke Order
    public function order(){
        return $this->belongsTo(Order::class);
    }

    // Relasi Ke Menu Item
    public function menuItem(){
        return $this->belongsTo(MenuItem::class);
    }
}
