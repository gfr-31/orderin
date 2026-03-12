<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::updateOrCreate(
            ['email' => 'admin@orderin.com'],
            [
                'name' => 'Super Admin',
                'password' => 'admin123',
                'role' => 'superadmin',
                'phone' => '083813050855',
                'is_active' => 1,
            ]
        );
    }
}
