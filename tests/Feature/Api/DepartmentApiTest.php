<?php

use App\Models\Department;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('unauthenticated users cannot access department endpoints', function () {
    $this->getJson('/api/departments')->assertStatus(401);
    $this->postJson('/api/departments', [])->assertStatus(401);
    $this->putJson('/api/departments/1', [])->assertStatus(401);
    $this->deleteJson('/api/departments/1')->assertStatus(401);
});

test('authenticated users can list departments', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $departments = Department::factory()->count(3)->create();

    $response = $this->getJson('/api/departments');

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data')
        ->assertJsonFragment(['name' => $departments[0]->name]);
});

test('authenticated users can create a department', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/departments', [
        'name' => 'Human Resources',
        'description' => 'Handles recruitment and employee relations',
    ]);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'name' => 'Human Resources',
            'description' => 'Handles recruitment and employee relations',
        ]);

    $this->assertDatabaseHas('departments', [
        'name' => 'Human Resources',
    ]);
});

test('create department requires name and unique name', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Department::factory()->create(['name' => 'Finance']);

    // Missing name
    $this->postJson('/api/departments', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name']);

    // Duplicate name
    $this->postJson('/api/departments', ['name' => 'Finance'])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

test('authenticated users can update a department', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $department = Department::factory()->create(['name' => 'Marketing']);

    $response = $this->putJson("/api/departments/{$department->id}", [
        'name' => 'Global Marketing',
        'description' => 'Handles international marketing strategies',
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment([
            'name' => 'Global Marketing',
            'description' => 'Handles international marketing strategies',
        ]);

    $this->assertDatabaseHas('departments', [
        'id' => $department->id,
        'name' => 'Global Marketing',
    ]);
});

test('update department validations are enforced', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $department1 = Department::factory()->create(['name' => 'IT Support']);
    $department2 = Department::factory()->create(['name' => 'Operations']);

    // Name cannot be duplicate of another department
    $this->putJson("/api/departments/{$department1->id}", [
        'name' => 'Operations',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name']);

    // But name can be the same as current department
    $this->putJson("/api/departments/{$department1->id}", [
        'name' => 'IT Support',
        'description' => 'Updated Description',
    ])
        ->assertStatus(200);
});

test('authenticated users can delete a department', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $department = Department::factory()->create();

    $response = $this->deleteJson("/api/departments/{$department->id}");

    $response->assertStatus(204);

    $this->assertDatabaseMissing('departments', [
        'id' => $department->id,
    ]);
});
