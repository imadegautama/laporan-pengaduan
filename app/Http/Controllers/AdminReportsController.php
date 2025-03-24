<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Report;
use App\Models\Response;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminReportsController extends Controller
{
    /**
     * Display a listing of reports.
     */
    public function index()
    {
        $categories = Category::all();

        // Get report statistics
        $stats = [
            'total' => Report::count(),
            'pending' => Report::where('status', 'PENDING')->count(),
            'in_process' => Report::where('status', 'IN_PROCESS')->count(),
            'resolved' => Report::where('status', 'RESOLVED')->count(),
            'rejected' => Report::where('status', 'REJECTED')->count(),
        ];

        // Get all reports for the datatable
        $reports = Report::with(['category', 'user'])
            ->withCount('responses')
            ->latest()
            ->get();

        return Inertia::render('admin/reports/index', [
            'reports' => $reports,
            'categories' => $categories,
            'stats' => $stats
        ]);
    }

    /**
     * Display the specified report details.
     */
    public function show(string $id)
    {
        $report = Report::with(['category', 'user', 'responses.user'])
            ->findOrFail($id);

        return Inertia::render('admin/reports/show', [
            'report' => $report,
        ]);
    }

    /**
     * Update the status of a report.
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:PENDING,IN_PROCESS,RESOLVED,REJECTED',
        ]);

        $report = Report::findOrFail($id);
        $oldStatus = $report->status;
        $report->status = $request->status;
        $report->save();

        // Create automatic response to track status change
        if ($oldStatus !== $request->status) {
            Response::create([
                'report_id' => $report->report_id,
                'user_id' => Auth::id(),
                'message' => "Status changed from {$oldStatus} to {$request->status}."
            ]);
        }

        return back()->with('success', 'Report status updated successfully');
    }

    /**
     * Store a response for the report.
     */
    public function storeResponse(Request $request, string $id)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $report = Report::findOrFail($id);

        Response::create([
            'report_id' => $report->report_id,
            'user_id' => Auth::id(),
            'message' => $validated['message']
        ]);

        return back()->with('success', 'Response added successfully');
    }
}
