<?php

namespace Database\Seeders;

use App\Models\Response;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class ResponseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin users
        $adminUsers = User::where('role', 'ADMIN')->pluck('user_id')->toArray();

        if (empty($adminUsers)) {
            $this->command->info('No admin users found. Skipping response seeding.');
            return;
        }

        // Get all IN_PROCESS and RESOLVED reports
        $reports = Report::whereIn('status', ['IN_PROCESS', 'RESOLVED'])->get();

        // Sample responses
        $responseTemplates = [
            // Initial responses
            [
                "Thank you for reporting this issue. We've assigned a team to investigate and will update you on the progress.",
                "We have received your report and are evaluating the situation. A maintenance crew will be dispatched soon.",
                "Your report has been received and prioritized. We're scheduling an inspection to assess the situation.",
                "Thank you for bringing this to our attention. We've logged this issue and assigned it to the appropriate department.",
            ],

            // Follow-up responses
            [
                "Following our initial assessment, we've determined this will require additional resources. The repair has been scheduled for next week.",
                "Our team has inspected the site and confirmed the issue. Repairs are now underway and should be completed within 3-5 business days.",
                "After reviewing your report, we've identified the root cause and have begun implementing a solution. We appreciate your patience.",
                "The maintenance team has been dispatched and is currently working on this issue. They estimate completion by the end of the day.",
            ],

            // Resolution responses
            [
                "We're pleased to inform you that the reported issue has been resolved. Please let us know if you notice any further problems.",
                "The repairs have been completed and our quality control team has verified the work. Thank you for your patience throughout this process.",
                "We've successfully addressed the issue you reported. The area has been restored and is now fully functional.",
                "The matter has been resolved. Our team has completed all necessary repairs and the area is now safe and accessible.",
            ],
        ];

        foreach ($reports as $report) {
            // Define how many responses this report should have based on status
            $numResponses = 1; // Default for IN_PROCESS

            if ($report->status === 'RESOLVED') {
                $numResponses = rand(2, 3); // Resolved reports have 2-3 responses
            }

            // Create responses with appropriate timing
            for ($i = 0; $i < $numResponses; $i++) {
                $responseType = min($i, 2); // 0 = initial, 1 = follow-up, 2 = resolution
                $possibleResponses = $responseTemplates[$responseType];
                $content = $possibleResponses[array_rand($possibleResponses)];

                // Create the response with appropriate timestamps
                Response::create([
                    'report_id' => $report->report_id,
                    'user_id' => $adminUsers[array_rand($adminUsers)],
                    'message' => $content,
                    'created_at' => $report->created_at->addDays($i + 1), // Stagger responses by days
                    'updated_at' => $report->created_at->addDays($i + 1),
                ]);
            }
        }
    }
}
