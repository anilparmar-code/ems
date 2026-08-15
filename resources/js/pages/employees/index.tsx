import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import EmployeeController from '@/actions/App/Http/Controllers/EmployeeController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Trash2, Users } from 'lucide-react';

interface Department {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    designation: string;
    salary: number | null;
    department_id: number;
    status: 'active' | 'inactive';
    department?: Department;
    created_at: string;
    updated_at: string;
}

interface Props {
    employees: Employee[];
    departments: Department[];
}

export default function EmployeesIndex({ employees, departments }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

    const inputSelectClasses =
        "border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-neutral-900";

    return (
        <>
            <Head title="Employees" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Employees"
                        description="Manage company employees, their designations, departments, and salaries."
                    />
                    <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Employee
                    </Button>
                </div>

                {employees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 py-12 dark:border-neutral-700">
                        <Users className="h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-semibold">No employees found</h3>
                        <p className="text-sm text-neutral-500">Add an employee to get started.</p>
                        <Button onClick={() => setCreateOpen(true)} className="mt-4">
                            Add Employee
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name / Designation</th>
                                    <th scope="col" className="px-6 py-3">Contact</th>
                                    <th scope="col" className="px-6 py-3">Department</th>
                                    <th scope="col" className="px-6 py-3">Salary</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {employees.map((employee) => (
                                    <tr key={employee.id} className="bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800/50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-900 dark:text-white">{employee.name}</div>
                                            <div className="text-xs text-neutral-500">{employee.designation}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{employee.email}</div>
                                            {employee.phone && <div className="text-xs text-neutral-500">{employee.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {employee.department?.name || <span className="italic text-neutral-400">No Department</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {employee.salary !== null ? (
                                                new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                }).format(employee.salary)
                                            ) : (
                                                <span className="italic text-neutral-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                                {employee.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setEditingEmployee(employee)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setDeletingEmployee(employee)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Create Dialog */}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Employee</DialogTitle>
                            <DialogDescription>
                                Add a new employee to the database. All fields except phone and salary are required.
                            </DialogDescription>
                        </DialogHeader>

                        <Form
                            {...EmployeeController.store.form()}
                            onSuccess={() => setCreateOpen(false)}
                            invalidateCacheTags={['employees']}
                            resetOnSuccess
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-name">Name</Label>
                                        <Input id="create-name" name="name" required placeholder="e.g. Jane Doe" />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-email">Email</Label>
                                        <Input id="create-email" name="email" type="email" required placeholder="jane.doe@example.com" />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-phone">Phone</Label>
                                        <Input id="create-phone" name="phone" placeholder="Optional phone number" />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-designation">Designation</Label>
                                        <Input id="create-designation" name="designation" required placeholder="e.g. Senior Software Engineer" />
                                        <InputError message={errors.designation} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-salary">Salary</Label>
                                        <Input id="create-salary" name="salary" type="number" step="0.01" min="0" placeholder="Optional salary" />
                                        <InputError message={errors.salary} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-department">Department</Label>
                                        <select
                                            id="create-department"
                                            name="department_id"
                                            required
                                            defaultValue=""
                                            className={inputSelectClasses}
                                        >
                                            <option value="" disabled>Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.department_id} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-status">Status</Label>
                                        <select
                                            id="create-status"
                                            name="status"
                                            required
                                            defaultValue="active"
                                            className={inputSelectClasses}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <DialogFooter className="gap-2 pt-2">
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={processing}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={editingEmployee !== null} onOpenChange={(open) => !open && setEditingEmployee(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Employee</DialogTitle>
                            <DialogDescription>
                                Update the employee's details.
                            </DialogDescription>
                        </DialogHeader>

                        {editingEmployee && (
                            <Form
                                {...EmployeeController.update.form({ employee: editingEmployee.id })}
                                onSuccess={() => setEditingEmployee(null)}
                                invalidateCacheTags={['employees']}
                                className="space-y-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-name">Name</Label>
                                            <Input
                                                id="edit-name"
                                                name="name"
                                                required
                                                defaultValue={editingEmployee.name}
                                                placeholder="e.g. Jane Doe"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-email">Email</Label>
                                            <Input
                                                id="edit-email"
                                                name="email"
                                                type="email"
                                                required
                                                defaultValue={editingEmployee.email}
                                                placeholder="jane.doe@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-phone">Phone</Label>
                                            <Input
                                                id="edit-phone"
                                                name="phone"
                                                defaultValue={editingEmployee.phone ?? ''}
                                                placeholder="Optional phone number"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-designation">Designation</Label>
                                            <Input
                                                id="edit-designation"
                                                name="designation"
                                                required
                                                defaultValue={editingEmployee.designation}
                                                placeholder="e.g. Senior Software Engineer"
                                            />
                                            <InputError message={errors.designation} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-salary">Salary</Label>
                                            <Input
                                                id="edit-salary"
                                                name="salary"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                defaultValue={editingEmployee.salary ?? ''}
                                                placeholder="Optional salary"
                                            />
                                            <InputError message={errors.salary} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-department">Department</Label>
                                            <select
                                                id="edit-department"
                                                name="department_id"
                                                required
                                                defaultValue={editingEmployee.department_id}
                                                className={inputSelectClasses}
                                            >
                                                {departments.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.department_id} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-status">Status</Label>
                                            <select
                                                id="edit-status"
                                                name="status"
                                                required
                                                defaultValue={editingEmployee.status}
                                                className={inputSelectClasses}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            <InputError message={errors.status} />
                                        </div>

                                        <DialogFooter className="gap-2 pt-2">
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button type="submit" disabled={processing}>
                                                Update
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={deletingEmployee !== null} onOpenChange={(open) => !open && setDeletingEmployee(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Employee</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the employee <strong className="text-neutral-900 dark:text-neutral-100">{deletingEmployee?.name}</strong>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        {deletingEmployee && (
                            <Form
                                {...EmployeeController.destroy.form({ employee: deletingEmployee.id })}
                                onSuccess={() => setDeletingEmployee(null)}
                                invalidateCacheTags={['employees']}
                            >
                                {({ processing }) => (
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={processing}>Cancel</Button>
                                        </DialogClose>
                                        <Button variant="destructive" type="submit" disabled={processing}>
                                            Delete
                                        </Button>
                                    </DialogFooter>
                                )}
                            </Form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

EmployeesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Employees',
            href: '/employees',
        },
    ],
};
