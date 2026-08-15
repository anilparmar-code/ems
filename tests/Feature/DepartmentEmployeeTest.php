<?php

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Database\QueryException;

test('can create a department', function () {
    $department = Department::factory()->create([
        'name' => 'Engineering',
        'description' => 'Software engineering department',
    ]);

    $this->assertDatabaseHas('departments', [
        'id' => $department->id,
        'name' => 'Engineering',
        'description' => 'Software engineering department',
    ]);
});

test('department name must be unique', function () {
    Department::factory()->create(['name' => 'Engineering']);

    expect(fn () => Department::factory()->create(['name' => 'Engineering']))
        ->toThrow(QueryException::class);
});

test('can create an employee and associate with a department', function () {
    $department = Department::factory()->create(['name' => 'Sales']);

    $employee = Employee::factory()->create([
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'phone' => '1234567890',
        'designation' => 'Sales Executive',
        'salary' => 50000.00,
        'department_id' => $department->id,
        'status' => 'active',
    ]);

    $this->assertDatabaseHas('employees', [
        'id' => $employee->id,
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'phone' => '1234567890',
        'designation' => 'Sales Executive',
        'salary' => 50000.00,
        'department_id' => $department->id,
        'status' => 'active',
    ]);
});

test('employee email must be unique', function () {
    Employee::factory()->create(['email' => 'duplicate@example.com']);

    expect(fn () => Employee::factory()->create(['email' => 'duplicate@example.com']))
        ->toThrow(QueryException::class);
});

test('department has many employees relation works', function () {
    $department = Department::factory()->create();
    $employee1 = Employee::factory()->create(['department_id' => $department->id]);
    $employee2 = Employee::factory()->create(['department_id' => $department->id]);

    expect($department->employees)->toHaveCount(2)
        ->and($department->employees->pluck('id'))->toContain($employee1->id, $employee2->id);
});

test('employee belongs to department relation works', function () {
    $department = Department::factory()->create();
    $employee = Employee::factory()->create(['department_id' => $department->id]);

    expect($employee->department->id)->toBe($department->id)
        ->and($employee->department->name)->toBe($department->name);
});

test('deleting a department cascade deletes its employees', function () {
    $department = Department::factory()->create();
    $employee = Employee::factory()->create(['department_id' => $department->id]);

    $department->delete();

    $this->assertDatabaseMissing('departments', ['id' => $department->id]);
    $this->assertDatabaseMissing('employees', ['id' => $employee->id]);
});
