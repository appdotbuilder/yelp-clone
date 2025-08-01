<?php

use App\Http\Controllers\BusinessController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', [BusinessController::class, 'index'])->name('home');

// Business routes
Route::get('/businesses', [BusinessController::class, 'index'])->name('businesses.index');
Route::get('/businesses/{business}', [BusinessController::class, 'show'])->name('businesses.show');

// Review routes (require authentication)
Route::middleware('auth')->group(function () {
    Route::post('/businesses/{business}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
