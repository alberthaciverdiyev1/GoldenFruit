<?php

namespace Modules\User\Http\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Session;
use Modules\User\Http\Entities\User;

class UserService
{
    private User $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function register(array $data): array
    {
        try {
            $user = DB::transaction(function () use ($data) {
                $data['password'] = Hash::make($data['password']);
                $user = $this->model->create($data);
                Auth::login($user);
                Session::put('user_id', $user->id);
                return $user;
            });

            return [
                'status' => true,
                'message' => 'User registered successfully',
                'data' => $user
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function login(array $credentials): array
    {
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            Session::put('user_id', $user->id);
            return [
                'status' => true,
                'message' => 'Login successful',
                'user' => $user
            ];
        }

        return [
            'status' => false,
            'message' => 'Invalid credentials'
        ];
    }

    public function logout(): array
    {
        Session::forget('user_id');
        Auth::logout();
        Session::invalidate();
        Session::regenerateToken();

        return [
            'status' => true,
            'message' => 'Logged out successfully'
        ];
    }

    public function forgotPassword(string $email): array
    {
        $status = Password::sendResetLink(['email' => $email]);

        return [
            'status' => $status === 'passwords.sent',
            'message' => __($status)
        ];
    }

    public function resetPassword(array $data): array
    {
        $status = Password::reset(
            $data,
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();

                Auth::login($user);
                Session::put('user_id', $user->id);
            }
        );

        return [
            'status' => $status === 'passwords.reset',
            'message' => __($status)
        ];
    }

    public function currentUser(): ?User
    {
        return Auth::user();
    }

    public function isLoggedIn(): bool
    {
        return Auth::check();
    }
}
