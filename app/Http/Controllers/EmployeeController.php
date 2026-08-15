<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\StoreEmployeeRequest;
use App\Http\Requests\Api\UpdateEmployeeRequest;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $employees = Employee::with('department')
            ->orderBy('name')
            ->get();

        $departments = Department::orderBy('name')->get();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        Employee::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Employee created successfully.']);

        return to_route('employees.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $employee->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Employee updated successfully.']);

        return to_route('employees.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee): RedirectResponse
    {
        $employee->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Employee deleted successfully.']);

        return to_route('employees.index');
    }
}
