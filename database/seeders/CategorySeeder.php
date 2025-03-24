<?php

namespace Database\Seeders;

use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'category_name' => 'Infrastructure',
                'description' => 'Issues related to roads, bridges, and public facilities',
                "created_at" => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
            ],
            [
                'category_name' => 'Public Safety',
                'description' => 'Reports about crimes, accidents, and public disturbances',
                "created_at" => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
            ],
            [
                'category_name' => 'Health',
                'description' => 'Complaints about healthcare services and public health',
                "created_at" => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
            ],
            [
                'category_name' => 'Environment',
                'description' => 'Environmental issues like pollution, waste management, and green spaces',
                "created_at" => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
            ],
            [
                'category_name' => 'Administration',
                'description' => 'Issues related to government services and bureaucracy',
                "created_at" => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
            ],
        ];

        DB::table('categories')->insert($categories);
    }
}
