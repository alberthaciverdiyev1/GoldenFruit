<?php

use Illuminate\Support\Facades\Route;
use Modules\User\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider within the "web" middleware group.
| They support sessions, CSRF protection, and cookie-based authentication.
|
*/

Route::middleware('auth')->group(function () {
    Route::get('/', [UserController::class, 'currentUser'])->name('user.index');
    Route::get('/dashboard', [UserController::class, 'profile'])->name('dashboard');
    Route::post('/logout', [UserController::class, 'logout'])->name('logout');
});

Route::middleware('guest')->group(function () {
    Route::get('/register', [UserController::class, 'register'])->name('register');
    Route::post('/register', [UserController::class, 'register'])->name('register');

    Route::get('/login', [UserController::class, 'login'])->name('login');
    Route::post('/login', [UserController::class, 'login'])->name('login');

    Route::get('/forgot-password', [UserController::class, 'forgotPassword'])->name('forgot.password');
    Route::post('/forgot-password', [UserController::class, 'forgotPassword'])->name('forgot.password');

});
