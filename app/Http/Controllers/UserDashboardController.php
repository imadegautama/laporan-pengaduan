<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get 5 most recent reports
        $recentReports = Report::where('user_id', $user->user_id)
            ->with('category')
            ->latest()
            ->limit(5)
            ->get();

        // Get reports count statistics
        $reportsCount = [
            'total' => Report::where('user_id', $user->user_id)->count(),
            'pending' => Report::where('user_id', $user->user_id)->where('status', 'PENDING')->count(),
            'in_process' => Report::where('user_id', $user->user_id)->where('status', 'IN_PROCESS')->count(),
            'resolved' => Report::where('user_id', $user->user_id)->where('status', 'RESOLVED')->count(),
        ];

        return Inertia::render('user/dashboard', [
            'recentReports' => $recentReports,
            'reportsCount' => $reportsCount,
        ]);
    }
}
