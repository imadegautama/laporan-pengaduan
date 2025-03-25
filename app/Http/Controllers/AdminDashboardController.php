<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Report;
use App\Models\Response;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard with relevant statistics.
     */
    public function index()
    {
        // Get report statistics
        $stats = [
            'total' => Report::count(),
            'pending' => Report::where('status', 'PENDING')->count(),
            'in_process' => Report::where('status', 'IN_PROCESS')->count(),
            'resolved' => Report::where('status', 'RESOLVED')->count(),
            'rejected' => Report::where('status', 'REJECTED')->count(),
            'total_users' => User::count(),
            'total_categories' => Category::count(),
            'total_responses' => Response::count(),
        ];

        // Get recent reports
        $recentReports = Report::with(['user', 'category'])
            ->withCount('responses')
            ->latest()
            ->limit(5)
            ->get();

        // Get categories with report counts
        $categories = Category::withCount('reports')
            ->orderByDesc('reports_count')
            ->get();

        // Get reports by day for the last 14 days
        $reportsByDay = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $reportsByDay[] = [
                'date' => Carbon::now()->subDays($i)->format('M d'),
                'count' => Report::whereDate('created_at', $date)->count()
            ];
        }

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentReports' => $recentReports,
            'categories' => $categories,
            'reportsByDay' => $reportsByDay,
        ]);
    }
}
