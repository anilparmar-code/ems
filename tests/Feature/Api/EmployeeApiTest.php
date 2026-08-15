<?php

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('unauthenticated users cannot access employee endpoints', function () {
    $this->getJson('/api/employees')->assertStatus(401);
    $this->postJson('/api/employees', [])->assertStatus(401);
    $this->putJson('/api/employees/1', [])->assertStatus(401);
    $this->deleteJson('/api/employees/1')->assertStatus(401);
});

test('authenticated users can list employees', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $department = Department::factory()->create();
    $employees = Employee::factory()->count(2)->create([
        'department_id' => $department->id,
    ]);

    $response = $this->getJson('/api/employees');

    $response->assertStatus(200)
        ->assertJsonCount(2, 'data')
        ->assertJsonFragment(['name' => $employees[0]->name])
        ->assertJsonFragment(['name' => $employees[1]->name]);
});

test('authenticated users can create an employee', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $department = Department::factory()->create();

    $response = $this->postJson('/api/employees', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'designation' => 'Software Engineer',
        'salary' => 60000.00,
        'department_id' => $department->id,
        'status' => 'active',
    ]);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'designation' => 'Software Engineer',
            'status' => 'active',
        ]);

    $this->assertDatabaseHas('employees', [
        'email' => 'john@example.com',
    ]);
});

test('create employee validations are enforced', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    // Missing fields
    $this->postJson('/api/employees', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'designation', 'department_id', 'status']);

    // Duplicate email
    $existing = Employee::factory()->create(['email' => 'exists@example.com']);
    $this->postJson('/api/employees', [
        'name' => 'New User',
        'email' => 'exists@example.com',
        'designation' => 'Designer',
        'department_id' => $existing->department_id,
        'status' => 'active',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('authenticated users can update an employee', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $employee = Employee::factory()->create(['name' => 'Old Name']);
    $otherDept = Department::factory()->create();

    $response = $this->putJson("/api/employees/{$employee->id}", [
        'name' => 'New Name',
        'email' => $employee->email,
        'designation' => 'Lead Developer',
        'department_id' => $otherDept->id,
        'status' => 'inactive',
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment([
            'name' => 'New Name',
            'designation' => 'Lead Developer',
            'status' => 'inactive',
        ]);

    $this->assertDatabaseHas('employees', [
        'id' => $employee->id,
        'name' => 'New Name',
    ]);
});

test('authenticated users can delete an employee', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $employee = Employee::factory()->create();

    $response = $this->deleteJson("/api/employees/{$employee->id}");

    $response->assertStatus(204);

    $this->assertDatabaseMissing('employees', [
        'id' => $employee->id,
    ]);
});
