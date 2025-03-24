import { DataTable } from '@/components/datatable';
import { DeleteDialog } from '@/components/delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { ICategory } from '@/types/category';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';

interface CategoryProps {
    categories: ICategory[];
}

function CategoryPage({ categories }: CategoryProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const columns: ColumnDef<ICategory>[] = [
        {
            accessorKey: 'category_name',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(category.category_id)}>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDeleteDialog(category.category_id)} className="text-destructive">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const openDeleteDialog = (id: number) => {
        setCategoryToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleEdit = (id: number) => {
        router.visit(`/admin/categories/${id}/edit`);
    };

    const handleDelete = () => {
        if (categoryToDelete) {
            setIsDeleting(true);
            router.delete(`/admin/categories/${categoryToDelete}`, {
                onFinish: () => setIsDeleting(false),
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Categories" />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage your report categories</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/categories/create">
                            <Button size="sm" className="cursor-pointer">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={categories} searchField="category_name" searchPlaceholder="Search categories..." />
                    </CardContent>
                </Card>
            </div>
            <DeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                variant="destructive"
                isLoading={isDeleting}
            />
        </AppLayout>
    );
}

export default CategoryPage;
