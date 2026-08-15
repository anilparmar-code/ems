<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'designation' => fake()->jobTitle(),
            'salary' => fake()->optional()->randomFloat(2, 30000, 150000),
            'department_id' => Department::factory(),
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }
}
