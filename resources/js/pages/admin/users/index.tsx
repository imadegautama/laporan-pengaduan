import { DataTable } from '@/components/datatable';
import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, PlusCircle, ShieldCheck, Trash, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';

interface User {
    user_id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    email_verified_at: string | null;
    created_at: string;
    reports_count?: number;
}

interface AdminUsersProps {
    users: User[];
    stats: {
        total: number;
        admin: number;
        verified: number;
    };
}

export default function AdminUsers({ users, stats }: AdminUsersProps) {
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Handle delete button click
    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (userToDelete) {
            setIsDeleting(true);
            router.delete(route('admin.users.destroy', userToDelete.user_id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setUserToDelete(null);
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            });
        }
    };

    // Format date function
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not verified';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Define table columns
    const columns: ColumnDef<User>[] = [
        {
            id: 'user_id',
            accessorKey: 'user_id',
            header: 'ID',
            cell: ({ row }) => <span className="font-medium">#{row.original.user_id}</span>,
        },
        {
            id: 'name',
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
        },
        {
            id: 'email',
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => <div className="text-muted-foreground">{row.original.email}</div>,
        },
        {
            id: 'role',
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => (
                <Badge
                    className={
                        row.original.role === 'ADMIN'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }
                >
                    {row.original.role === 'ADMIN' ? (
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            ADMIN
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <UserRound className="h-3 w-3" />
                            USER
                        </div>
                    )}
                </Badge>
            ),
            filterFn: (row, id, value) => {
                if (!value || value === '') return true;
                return row.original.role === value;
            },
        },
        // {
        //     id: 'email_verified_at',
        //     accessorKey: 'email_verified_at',
        //     header: 'Verified',
        //     cell: ({ row }) => (
        //         <Badge
        //             variant={row.original.email_verified_at ? 'outline' : 'secondary'}
        //             className={row.original.email_verified_at ? 'text-green-500' : 'text-yellow-500'}
        //         >
        //             {row.original.email_verified_at ? 'Yes' : 'No'}
        //         </Badge>
        //     ),
        // },
        {
            id: 'reports_count',
            accessorKey: 'reports_count',
            header: 'Reports',
            cell: ({ row }) => <div className="text-center">{row.original.reports_count || 0}</div>,
        },
        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => formatDate(row.original.created_at),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const user = row.original;
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
                            <DropdownMenuItem onClick={() => router.visit(route('admin.users.edit', user.user_id))}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteClick(user)} className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // Filter users based on role selection
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            if (roleFilter && user.role !== roleFilter) {
                return false;
            }
            return true;
        });
    }, [users, roleFilter]);

    return (
        <AppLayout>
            <Head title="Manage Users" />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
                    <p className="text-muted-foreground mt-1">View and manage system users</p>
                </div>

                {/* Statistics Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <UserRound className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Admins</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">{stats.admin}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                            <Badge variant="outline" className="text-green-500">
                                Verified
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.verified}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Controls */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-4">
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="USER">User</SelectItem>
                                    </SelectContent>
                                </Select>

                                {roleFilter && (
                                    <Button variant="ghost" onClick={() => setRoleFilter('')}>
                                        Clear Filter
                                    </Button>
                                )}
                            </div>

                            <Button onClick={() => router.visit(route('admin.users.create'))}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New User
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardContent className="pt-6">
                        <DataTable
                            columns={columns}
                            data={filteredUsers}
                            searchField="name"
                            searchPlaceholder="Search users..."
                            showColumnToggle
                            showPagination
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete User"
                description={
                    userToDelete ? (
                        <div className="space-y-2">
                            <p>Are you sure you want to delete the following user?</p>
                            <div className="bg-muted rounded-md p-3">
                                <div className="font-medium">{userToDelete.name}</div>
                                <div className="text-muted-foreground text-sm">{userToDelete.email}</div>
                            </div>
                            <p className="text-destructive text-sm">
                                This action cannot be undone. All data associated with this user will be permanently removed.
                            </p>
                        </div>
                    ) : (
                        'Are you sure you want to delete this user?'
                    )
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                variant="destructive"
                isLoading={isDeleting}
            />
        </AppLayout>
    );
}
