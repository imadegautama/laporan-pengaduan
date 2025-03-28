<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // User::factory()->create([
        //     'name' => 'I Made Gautama',
        //     'email' => 'imadegautama@gmail.com',
        //     'role' => 'ADMIN'
        // ]);

        // User::factory()->create([
        //     'name' => 'User 1',
        //     'email' => 'user@gmail.com',
        //     'role' => 'USER'
        // ]);

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ReportSeeder::class,
            ResponseSeeder::class,
        ]);
    }
}
