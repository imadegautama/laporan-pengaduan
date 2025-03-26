<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

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
                'description' => 'Issues related to roads, buildings, bridges, etc.',
            ],
            [
                'category_name' => 'Public Safety',
                'description' => 'Concerns about safety in public spaces or emergencies',
            ],
            [
                'category_name' => 'Sanitation',
                'description' => 'Problems with waste management, drainage, or cleanliness',
            ],
            [
                'category_name' => 'Public Transportation',
                'description' => 'Issues related to public transportation services',
            ],
            [
                'category_name' => 'Public Utilities',
                'description' => 'Problems with water, electricity, or other utilities',
            ],
            [
                'category_name' => 'Environmental',
                'description' => 'Concerns about pollution, green spaces, or environmental damage',
            ],
            [
                'category_name' => 'Administrative',
                'description' => 'Issues with government services or administration',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
