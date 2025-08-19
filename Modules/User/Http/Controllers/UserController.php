<?php

namespace Modules\User\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;
use Modules\User\Http\Services\UserService;
use Nwidart\Modules\Facades\Module;

class UserController extends Controller
{
    private UserService $service;

    function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function register(Request $request)
    {
        if ($request->isMethod('POST')) {
            $validated = $request->validate([
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
            ]);

            return $this->service->register($validated);
        }

        return view('user.register');
    }

    public function login(Request $request)
    {
        if ($request->isMethod('POST')) {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            $result = $this->service->login($credentials);

            if ($result['status']) {
                return redirect()->route('dashboard');
            }

            return redirect()->back()->withErrors([
                'email' => $result['message']
            ])->withInput();
        }

        return view('user.login');
    }


    public function logout()
    {
        return response()->json($this->service->logout());
    }

    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email'
        ]);

        return response()->json($this->service->forgotPassword($validated['email']));
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $data = [
            'email' => $validated['email'],
            'password' => $validated['password'],
            'password_confirmation' => $request->input('password_confirmation'),
            'token' => $validated['token'],
        ];

        return response()->json($this->service->resetPassword($data));
    }


    public function currentUser()
    {
        return response()->json($this->service->currentUser());
    }
}
