import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import DepartmentController from '@/actions/App/Http/Controllers/DepartmentController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Building2, Edit, Plus, Trash2 } from 'lucide-react';

interface Department {
    id: number;
    name: string;
    description: string | null;
    employees_count?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    departments: Department[];
}

export default function DepartmentsIndex({ departments }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);

    return (
        <>
            <Head title="Departments" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Departments"
                        description="Manage company departments and view employee assignments."
                    />
                    <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Department
                    </Button>
                </div>

                {departments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 py-12 dark:border-neutral-700">
                        <Building2 className="h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-semibold">No departments found</h3>
                        <p className="text-sm text-neutral-500">Create a department to get started.</p>
                        <Button onClick={() => setCreateOpen(true)} className="mt-4">
                            Add Department
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {departments.map((department) => (
                            <Card key={department.id} className="flex flex-col">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg font-bold">{department.name}</CardTitle>
                                        <Badge variant="secondary">
                                            {department.employees_count ?? 0} {department.employees_count === 1 ? 'Employee' : 'Employees'}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2 mt-1 min-h-[2.5rem]">
                                        {department.description || <span className="italic text-neutral-400">No description provided</span>}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1" />
                                <CardFooter className="flex justify-end gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingDepartment(department)}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeletingDepartment(department)}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create Dialog */}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Department</DialogTitle>
                            <DialogDescription>
                                Create a new department. The name must be unique.
                            </DialogDescription>
                        </DialogHeader>

                        <Form
                            {...DepartmentController.store.form()}
                            onSuccess={() => setCreateOpen(false)}
                            invalidateCacheTags={['departments', 'employees']}
                            resetOnSuccess
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-name">Name</Label>
                                        <Input
                                            id="create-name"
                                            name="name"
                                            required
                                            placeholder="e.g. Engineering"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-description">Description</Label>
                                        <Input
                                            id="create-description"
                                            name="description"
                                            placeholder="Optional description"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <DialogFooter className="gap-2">
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
                <Dialog open={editingDepartment !== null} onOpenChange={(open) => !open && setEditingDepartment(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Department</DialogTitle>
                            <DialogDescription>
                                Update the department's details.
                            </DialogDescription>
                        </DialogHeader>

                        {editingDepartment && (
                            <Form
                                {...DepartmentController.update.form({ department: editingDepartment.id })}
                                onSuccess={() => setEditingDepartment(null)}
                                invalidateCacheTags={['departments', 'employees']}
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
                                                defaultValue={editingDepartment.name}
                                                placeholder="e.g. Engineering"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="edit-description">Description</Label>
                                            <Input
                                                id="edit-description"
                                                name="description"
                                                defaultValue={editingDepartment.description ?? ''}
                                                placeholder="Optional description"
                                            />
                                            <InputError message={errors.description} />
                                        </div>

                                        <DialogFooter className="gap-2">
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
                <Dialog open={deletingDepartment !== null} onOpenChange={(open) => !open && setDeletingDepartment(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Department</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the department <strong className="text-neutral-900 dark:text-neutral-100">{deletingDepartment?.name}</strong>? All associated employees will also be permanently deleted. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        {deletingDepartment && (
                            <Form
                                {...DepartmentController.destroy.form({ department: deletingDepartment.id })}
                                onSuccess={() => setDeletingDepartment(null)}
                                invalidateCacheTags={['departments', 'employees']}
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

DepartmentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Departments',
            href: '/departments',
        },
    ],
};
