<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@orderin.com',
            'password' => 'admin',
            'role' => 'superadmin',
            'phone' => '083813050855',
            'is_active' => 1,
        ]);
    }
}
