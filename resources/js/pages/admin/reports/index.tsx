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
import { CheckCircle2, Clock, Eye, FileText, HandCoins, LucideIcon, MessageCircle, MoreHorizontal, Trash, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Category {
    category_id: number;
    category_name: string;
}

interface User {
    user_id: number;
    name: string;
    email: string;
}

interface Report {
    report_id: number;
    user_id: number;
    title: string;
    description: string;
    category_id: number;
    image: string;
    status: 'PENDING' | 'IN_PROCESS' | 'RESOLVED' | 'REJECTED';
    created_at: string;
    updated_at: string;
    category: Category;
    user: User;
    responses_count: number;
}

interface AdminReportsProps {
    reports: Report[];
    categories: Category[];
    stats: {
        total: number;
        pending: number;
        in_process: number;
        resolved: number;
        rejected: number;
    };
}

export default function AdminReports({ reports, categories, stats }: AdminReportsProps) {
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Handle delete button click
    const handleDeleteClick = (report: Report) => {
        setReportToDelete(report);
        setIsDeleteDialogOpen(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (reportToDelete) {
            setIsDeleting(true);
            router.delete(route('admin.reports.destroy', reportToDelete.report_id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setReportToDelete(null);
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            });
        }
    };

    // Format date function
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: Report['status'] }) => {
        const statusConfig: Record<Report['status'], { color: string; icon: LucideIcon }> = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: Clock },
            IN_PROCESS: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: HandCoins },
            RESOLVED: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: CheckCircle2 },
            REJECTED: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: XCircle },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    // Define table columns
    const columns: ColumnDef<Report>[] = [
        {
            id: 'report_id',
            accessorKey: 'report_id',
            header: 'ID',
            cell: ({ row }) => <span className="font-medium">{row.original.report_id}</span>,
        },
        {
            id: 'title',
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => <div className="max-w-[300px] truncate font-medium">{row.original.title}</div>,
        },
        {
            id: 'user',
            accessorKey: 'user.name',
            header: 'Reported By',
            cell: ({ row }) => <div>{row.original.user.name}</div>,
        },
        {
            id: 'category',
            accessorKey: 'category.category_name',
            header: 'Category',
            cell: ({ row }) => <Badge variant="outline">{row.original.category.category_name}</Badge>,
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
            filterFn: (row, id, value) => {
                if (!value || value === '') return true;
                return row.original.status === value;
            },
        },
        {
            id: 'responses',
            accessorKey: 'responses_count',
            header: 'Responses',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <MessageCircle className="text-muted-foreground h-4 w-4" />
                    <span>{row.original.responses_count}</span>
                </div>
            ),
        },
        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: 'Submitted',
            cell: ({ row }) => formatDate(row.original.created_at),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const report = row.original;
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
                            <DropdownMenuItem onClick={() => router.visit(route('admin.reports.show', report.report_id))}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteClick(report)} className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // Filter reports based on status and category selections
    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            let matchesStatus = true;
            let matchesCategory = true;

            if (statusFilter) {
                matchesStatus = report.status === statusFilter;
            }

            if (categoryFilter) {
                matchesCategory = report.category_id.toString() === categoryFilter;
            }

            return matchesStatus && matchesCategory;
        });
    }, [reports, statusFilter, categoryFilter]);

    return (
        <AppLayout>
            <Head title="Manage Reports" />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Manage Reports</h1>
                    <p className="text-muted-foreground mt-1">View and manage all submitted public reports</p>
                </div>

                {/* Statistics Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                            <FileText className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Process</CardTitle>
                            <HandCoins className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">{stats.in_process}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Controls */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="IN_PROCESS">In Process</SelectItem>
                                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.category_id} value={category.category_id.toString()}>
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStatusFilter('');
                                    setCategoryFilter('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports DataTable */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Reports ({filteredReports.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={filteredReports}
                            searchField="title"
                            searchPlaceholder="Search reports..."
                            showColumnToggle
                            showPagination
                            pageSize={10}
                        />
                    </CardContent>
                </Card>
            </div>
            <DeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Report"
                description={
                    reportToDelete ? (
                        <div className="space-y-2">
                            <p>Are you sure you want to delete this report?</p>
                            <div className="bg-muted rounded-md p-3">
                                <div className="font-medium">{reportToDelete.title}</div>
                                <div className="text-muted-foreground mt-1 text-sm">
                                    Report #{reportToDelete.report_id} • Submitted by {reportToDelete.user.name}
                                </div>
                            </div>
                            <p className="text-destructive text-sm">This action cannot be undone. All associated responses will also be deleted.</p>
                        </div>
                    ) : (
                        'Are you sure you want to delete this report?'
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
