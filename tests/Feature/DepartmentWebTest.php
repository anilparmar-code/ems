<?php

use App\Models\Department;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('unauthenticated users are redirected to login', function () {
    $this->get('/departments')->assertRedirect('/login');
    $this->post('/departments', [])->assertRedirect('/login');
    $this->put('/departments/1', [])->assertRedirect('/login');
    $this->delete('/departments/1')->assertRedirect('/login');
});

test('authenticated users can view departments index', function () {
    $user = User::factory()->create();
    $departments = Department::factory()->count(3)->create();

    $this->actingAs($user)
        ->get('/departments')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('departments/index')
            ->has('departments', 3)
            ->where('departments.0.name', $departments->sortBy('name')->first()->name)
        );
});

test('authenticated users can create a department', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/departments', [
            'name' => 'Human Resources',
            'description' => 'Recruitment and onboarding',
        ])
        ->assertRedirect('/departments');

    $this->assertDatabaseHas('departments', [
        'name' => 'Human Resources',
        'description' => 'Recruitment and onboarding',
    ]);
});

test('create department validates unique name', function () {
    $user = User::factory()->create();
    Department::factory()->create(['name' => 'Finance']);

    $this->actingAs($user)
        ->from('/departments')
        ->post('/departments', [
            'name' => 'Finance',
        ])
        ->assertRedirect('/departments')
        ->assertSessionHasErrors(['name']);
});

test('authenticated users can update a department', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create(['name' => 'Marketing']);

    $this->actingAs($user)
        ->put("/departments/{$department->id}", [
            'name' => 'Digital Marketing',
            'description' => 'Social media campaigns',
        ])
        ->assertRedirect('/departments');

    $this->assertDatabaseHas('departments', [
        'id' => $department->id,
        'name' => 'Digital Marketing',
        'description' => 'Social media campaigns',
    ]);
});

test('authenticated users can delete a department', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();

    $this->actingAs($user)
        ->delete("/departments/{$department->id}")
        ->assertRedirect('/departments');

    $this->assertDatabaseMissing('departments', [
        'id' => $department->id,
    ]);
});
