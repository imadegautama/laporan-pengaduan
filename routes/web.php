<?php

use App\Http\Controllers\AdminReportsController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminUsersController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// User routes
Route::middleware(['auth'])->group(function () {
    Route::prefix('user')->group(function () {
        Route::get('/report/create', [ReportsController::class, 'create'])->name('user.report.create');
        Route::post('/report', [ReportsController::class, 'store'])->name('user.report.store');
        Route::get('/report/{id}', [ReportsController::class, 'show'])->name('user.report.show');
        Route::get('/report', [ReportsController::class, 'index'])->name('user.report.index');
        Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('user.dashboard');
    });
});

// Admin routes
Route::middleware(['auth', AdminMiddleware::class])->group(function () {
    Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->group(function () {
        Route::resource('categories', CategoriesController::class);
        Route::get('/reports', [AdminReportsController::class, 'index'])->name('admin.reports.index');
        Route::get('/reports/{id}', [AdminReportsController::class, 'show'])->name('admin.reports.show');
        Route::delete('/reports/{id}', [AdminReportsController::class, 'destroy'])->name('admin.reports.destroy');
        Route::patch('/reports/{id}/status', [AdminReportsController::class, 'updateStatus'])->name('admin.reports.status');
        Route::post('/reports/{id}/responses', [AdminReportsController::class, 'storeResponse'])->name('admin.reports.responses.store');
        Route::get('/users', [AdminUsersController::class, 'index'])->name('admin.users.index');
        Route::get('/users/create', [AdminUsersController::class, 'create'])->name('admin.users.create');
        Route::post('/users', [AdminUsersController::class, 'store'])->name('admin.users.store');
        Route::get('/users/{id}/edit', [AdminUsersController::class, 'edit'])->name('admin.users.edit');
        Route::put('/users/{id}', [AdminUsersController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{id}', [AdminUsersController::class, 'destroy'])->name('admin.users.destroy');
    });
});




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
