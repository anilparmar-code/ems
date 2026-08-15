<?php

namespace App\Http\Requests\Api;

use App\Models\Employee;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $employee = $this->route('employee');
        $id = $employee instanceof Employee ? $employee->id : $employee;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:employees,email,'.$id],
            'phone' => ['nullable', 'string', 'max:30'],
            'designation' => ['required', 'string', 'max:255'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'department_id' => ['required', 'exists:departments,id'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ];
    }
}
