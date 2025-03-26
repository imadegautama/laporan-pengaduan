<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure we have the storage directory for images
        $directory = storage_path('app/public/reports');
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        // Get all users with role 'USER'
        $userIds = User::where('role', 'USER')->pluck('user_id')->toArray();

        // Get all categories
        $categoryIds = Category::pluck('category_id')->toArray();

        // Sample reports data
        $reports = [
            [
                'title' => 'Pothole on Main Street',
                'description' => "There's a large pothole on Main Street near the intersection with Oak Avenue. It's been there for over a month and has caused damage to several cars. It's approximately 2 feet wide and 6 inches deep. Please repair it as soon as possible to prevent accidents and further vehicle damage.",
                'status' => 'IN_PROCESS',
                'image' => 'reports/pothole.jpg', // You'll need an actual image
            ],
            [
                'title' => 'Broken streetlight on Cedar Road',
                'description' => "The streetlight at the corner of Cedar Road and Pine Street has been flickering for weeks and now has completely stopped working. This area is quite dark at night and poses a safety risk for pedestrians and drivers. Please replace or repair this light as soon as possible.",
                'status' => 'PENDING',
                'image' => 'reports/streetlight.jpg',
            ],
            [
                'title' => 'Overflowing trash bins at Central Park',
                'description' => "The trash bins in the east section of Central Park haven't been emptied in what appears to be several days. They're overflowing and trash is spreading around the area. This is attracting pests and creating an unpleasant environment for park visitors. Please clean up this area promptly.",
                'status' => 'RESOLVED',
                'image' => 'reports/trash.jpg',
            ],
            [
                'title' => 'Bus stop shelter damaged',
                'description' => "The bus stop shelter on Maple Avenue has been vandalized. The glass panels are broken and there's graffiti on the walls. This poses a safety hazard to commuters using the bus stop, especially during bad weather.",
                'status' => 'IN_PROCESS',
                'image' => 'reports/busstop.jpg',
            ],
            [
                'title' => 'Water leak from main pipe',
                'description' => "There is water constantly leaking from what appears to be a main water pipe on Willow Street. It's been ongoing for at least 3 days and is creating a pool of water on the sidewalk and road. This is not only wasting water but also creating a slippery hazard.",
                'status' => 'PENDING',
                'image' => 'reports/waterleak.jpg',
            ],
            [
                'title' => 'Illegal dumping near river',
                'description' => "I've noticed construction debris and other waste being dumped illegally along the riverbank behind the industrial area. This is harmful to the environment and wildlife, and could contaminate the river. Please investigate and clean up this area.",
                'status' => 'REJECTED',
                'image' => 'reports/dumping.jpg',
            ],
            [
                'title' => 'Incorrect property tax assessment',
                'description' => "I believe there's an error in my property tax assessment (Property ID: 12345). The square footage listed is 2,300 sq ft when my property is actually 1,800 sq ft. This has significantly increased my tax bill. Please review and correct this information.",
                'status' => 'IN_PROCESS',
                'image' => 'reports/document.jpg',
            ],
            [
                'title' => 'Drainage problem causing flooding',
                'description' => "The storm drain on Elm Street is completely blocked, causing significant flooding whenever it rains. The water rises several inches on the road and sidewalk, making it difficult and dangerous to pass. The drain needs to be cleared and possibly repaired.",
                'status' => 'RESOLVED',
                'image' => 'reports/flooding.jpg',
            ],
            [
                'title' => 'Unsafe playground equipment',
                'description' => "The slide at Children's Park has a large crack in it that could cause injuries to children using it. Additionally, several swings have broken chains. These equipment issues pose safety risks and should be repaired or replaced immediately.",
                'status' => 'PENDING',
                'image' => 'reports/playground.jpg',
            ],
            [
                'title' => 'Noise complaint about construction',
                'description' => "Construction at the new building site on 7th Avenue is constantly starting before 7:00 AM and continuing past 10:00 PM, violating city noise ordinances. This has been disrupting sleep and daily activities for all residents in the adjacent buildings for the past week.",
                'status' => 'REJECTED',
                'image' => 'reports/construction.jpg',
            ],
        ];

        // Create placeholder image if it doesn't exist
        $placeholderImage = 'reports/placeholder.jpg';
        $placeholderPath = storage_path('app/public/' . $placeholderImage);

        if (!File::exists($placeholderPath)) {
            // Generate a simple colored image
            $img = imagecreatetruecolor(800, 600);
            $bgColor = imagecolorallocate($img, 200, 200, 200);
            imagefill($img, 0, 0, $bgColor);

            $textColor = imagecolorallocate($img, 50, 50, 50);
            $text = "Placeholder Image";
            imagestring($img, 5, 300, 300, $text, $textColor);

            // Save the image
            imagejpeg($img, $placeholderPath, 90);
            imagedestroy($img);
        }

        // Create reports
        foreach ($reports as $reportData) {
            Report::create([
                'user_id' => $userIds[array_rand($userIds)],
                'title' => $reportData['title'],
                'description' => $reportData['description'],
                'category_id' => $categoryIds[array_rand($categoryIds)],
                'image' => $placeholderImage, // Use placeholder for all reports in the seeder
                'status' => $reportData['status'],
                'created_at' => now()->subDays(rand(1, 30)), // Random date within the last month
                'updated_at' => now()->subDays(rand(0, 7)), // Random update date within the last week
            ]);
        }
    }
}
