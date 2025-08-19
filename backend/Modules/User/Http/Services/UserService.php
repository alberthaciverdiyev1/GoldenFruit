<?php

namespace Modules\User\Http\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
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
                return $this->model->create($data);
            });

            $token = $user->createToken('api_token')->plainTextToken;

            return [
                'status' => true,
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
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
            $token = $user->createToken('api_token')->plainTextToken;

            return [
                'status' => true,
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
            ];
        }

        return [
            'status' => false,
            'message' => 'Invalid credentials'
        ];
    }

    public function logout(): array
    {
        $user = Auth::user();
        if ($user) {
            $user->tokens()->delete();
        }

        return [
            'status' => true,
            'message' => 'Logged out successfully'
        ];
    }

    public function forgotPassword(string $email): array
    {
        $status = Password::sendResetLink(['email' => $email]);

        return [
            'status' => $status === Password::RESET_LINK_SENT,
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
            }
        );

        return [
            'status' => $status === Password::PASSWORD_RESET,
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
