<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminUsersController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        // Get users with report counts
        $users = User::withCount('reports')->get();

        // Get user statistics
        $stats = [
            'total' => User::count(),
            'admin' => User::where('role', 'ADMIN')->count(),
            'verified' => User::whereNotNull('email_verified_at')->count(),
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('admin/users/form', [
            'isEditing' => false,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:ADMIN,USER',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Optionally trigger verification email if needed
        // event(new Registered($user));

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(string $id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('admin/users/form', [
            'user' => $user,
            'isEditing' => true,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id, 'user_id')],
            'role' => 'required|in:ADMIN,USER',
        ]);

        // Update email verification status if changed
        $emailChanged = $user->email !== $request->email;
        $wasVerified = $user->email_verified_at !== null;
        $shouldBeVerified = $request->email_verified_at !== null;

        // If email changed, reset verification unless admin explicitly verified it
        if ($emailChanged && !$shouldBeVerified) {
            $user->email_verified_at = null;
        } elseif ($shouldBeVerified && !$wasVerified) {
            $user->email_verified_at = now();
        } elseif (!$shouldBeVerified && $wasVerified) {
            $user->email_verified_at = null;
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->save();

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Prevent self-deletion
        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        // Delete user
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
