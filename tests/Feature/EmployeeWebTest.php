<?php

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('unauthenticated users are redirected to login', function () {
    $this->get('/employees')->assertRedirect('/login');
    $this->post('/employees', [])->assertRedirect('/login');
    $this->put('/employees/1', [])->assertRedirect('/login');
    $this->delete('/employees/1')->assertRedirect('/login');
});

test('authenticated users can view employees index', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $employees = Employee::factory()->count(2)->create(['department_id' => $department->id]);

    $this->actingAs($user)
        ->get('/employees')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('employees/index')
            ->has('employees', 2)
            ->has('departments', 1) // Only one department was created and associated with both employees
            ->where('employees.0.name', $employees->sortBy('name')->first()->name)
        );
});

test('authenticated users can create an employee via web', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();

    $this->actingAs($user)
        ->post('/employees', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'designation' => 'HR Manager',
            'department_id' => $department->id,
            'status' => 'active',
        ])
        ->assertRedirect('/employees');

    $this->assertDatabaseHas('employees', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ]);
});

test('create employee unique email validation is enforced via web', function () {
    $user = User::factory()->create();
    $existing = Employee::factory()->create(['email' => 'exists@example.com']);

    $this->actingAs($user)
        ->from('/employees')
        ->post('/employees', [
            'name' => 'New User',
            'email' => 'exists@example.com',
            'designation' => 'Analyst',
            'department_id' => $existing->department_id,
            'status' => 'active',
        ])
        ->assertRedirect('/employees')
        ->assertSessionHasErrors(['email']);
});

test('authenticated users can update an employee via web', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();

    $this->actingAs($user)
        ->put("/employees/{$employee->id}", [
            'name' => 'Updated Name',
            'email' => $employee->email,
            'designation' => 'Lead Architect',
            'department_id' => $employee->department_id,
            'status' => 'active',
        ])
        ->assertRedirect('/employees');

    $this->assertDatabaseHas('employees', [
        'id' => $employee->id,
        'name' => 'Updated Name',
    ]);
});

test('authenticated users can delete an employee via web', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();

    $this->actingAs($user)
        ->delete("/employees/{$employee->id}")
        ->assertRedirect('/employees');

    $this->assertDatabaseMissing('employees', [
        'id' => $employee->id,
    ]);
});
