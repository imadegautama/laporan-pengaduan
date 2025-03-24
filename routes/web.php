<?php

use App\Http\Controllers\AdminReportsController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
// User routes

Route::middleware(['auth'])->group(function () {
    Route::get('user/dashboard', [UserDashboardController::class, 'index'])->name('user.dashboard');
});

// Admin routes
Route::middleware(['auth', AdminMiddleware::class])->group(function () {
    Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->group(function () {
        Route::resource('categories', CategoriesController::class);
        Route::get('/reports', [AdminReportsController::class, 'index'])->name('admin.reports.index');
        Route::get('/reports/{id}', [AdminReportsController::class, 'show'])->name('admin.reports.show');
        Route::patch('/reports/{id}/status', [AdminReportsController::class, 'updateStatus'])->name('admin.reports.status');
        Route::post('/reports/{id}/responses', [AdminReportsController::class, 'storeResponse'])->name('admin.reports.responses.store');
    });
});




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
