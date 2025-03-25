<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReportsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports = Report::with('category')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('reports/index', [
            'reports' => $reports
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return Inertia::render('reports/form', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,category_id',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagePath = $request->file('image')->store('reports', 'public');


        $report = Report::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'user_id' => Auth::id(),
            'image' => $imagePath,
            'status' => 'PENDING'
        ]);

        return redirect()->route('user.report.index')
            ->with('success', 'Report submitted successfully. Your report is pending review.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $report = Report::with(['category', 'responses.user'])
            ->findOrFail($id);

        // Check if the report belongs to the authenticated user
        if ($report->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('reports/show', [
            'report' => $report
        ]);
    }
}
