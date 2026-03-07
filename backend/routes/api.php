<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Public Routes - Tidak Perlu Login
Route::prefix('v1')->group(function () {

    // Auth
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Menu (Publik Bisa Lihat Tanpa Login)
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category:slug}', [CategoryController::class, 'show']);
    Route::get('/menu', [MenuItemController::class, 'index']);
    Route::get('/menu/{menuItem:slug}', [MenuItemController::class, 'show']);

    // Webhook Midtrans Tidak Perlu Login
    Route::post('/payment/webhook', [PaymentController::class, 'webhook']);

    // Protected Route - Harus Login
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::patch('/orders/{order}/cancel', [OrderController::class, 'cancel']);

        // Payment
        Route::get('/orders/{order}/payment', [PaymentController::class, 'show']);
        Route::get('/orders/{order}/snap-token', [PaymentController::class, 'getSnapToken']);
    });
});
