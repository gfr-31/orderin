<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MenuItem extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'image',
        'is_available',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($menuItem) {
            $menuItem->slug = Str::slug($menuItem->name);
        });
    }

    // Relasi Ke Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relasi Ke Order Items
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getImageAttribute($value)
    {
        if (! $value) {
            return null;
        }

        if (str_starts_with($value, 'http')) {
            return $value;
        }

        return config('filesystems.disks.s3.url').'/'.$value;
    }
}
