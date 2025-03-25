import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock, FileText, HandCoins, UserRound, XCircle } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Category {
    category_id: number;
    category_name: string;
    reports_count: number;
}

interface User {
    user_id: number;
    name: string;
    email: string;
}

interface Report {
    report_id: number;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROCESS' | 'RESOLVED' | 'REJECTED';
    category: {
        category_id: number;
        category_name: string;
    };
    user: User;
    created_at: string;
    responses_count: number;
}

interface AdminDashboardProps {
    stats: {
        total: number;
        pending: number;
        in_process: number;
        resolved: number;
        rejected: number;
        total_users: number;
        total_categories: number;
        total_responses: number;
    };
    recentReports: Report[];
    categories: Category[];
    reportsByDay: {
        date: string;
        count: number;
    }[];
}
export default function AdminDashboard({ stats, recentReports, categories, reportsByDay }: AdminDashboardProps) {
    // Calculate status percentages
    const totalReports = stats.total || 1; // Prevent division by zero
    const pendingPercent = Math.round((stats.pending / totalReports) * 100);
    const inProcessPercent = Math.round((stats.in_process / totalReports) * 100);
    const resolvedPercent = Math.round((stats.resolved / totalReports) * 100);
    const rejectedPercent = Math.round((stats.rejected / totalReports) * 100);

    // Status badge component
    const StatusBadge = ({ status }: { status: Report['status'] }) => {
        switch (status) {
            case 'PENDING':
                return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">PENDING</Badge>;
            case 'IN_PROCESS':
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">IN PROCESS</Badge>;
            case 'RESOLVED':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">RESOLVED</Badge>;
            case 'REJECTED':
                return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">REJECTED</Badge>;
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of public reports and system statistics</p>
                </div>

                {/* Quick Stats Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                            <FileText className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-muted-foreground text-xs">All submitted reports</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Users</CardTitle>
                            <UserRound className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-muted-foreground text-xs">Registered users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <FileText className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_categories}</div>
                            <p className="text-muted-foreground text-xs">Report categories</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Responses</CardTitle>
                            <FileText className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_responses}</div>
                            <p className="text-muted-foreground text-xs">Total responses</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
                    {/* Left Column - 4/6 width */}
                    <div className="space-y-6 md:col-span-4">
                        {/* Reports Status Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Report Status Overview</CardTitle>
                                <CardDescription>Status breakdown of all reports</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                            <span>Pending</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {stats.pending} ({pendingPercent}%)
                                        </span>
                                    </div>
                                    <Progress value={pendingPercent} className="h-2 bg-yellow-100" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <HandCoins className="mr-2 h-4 w-4 text-blue-500" />
                                            <span>In Process</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {stats.in_process} ({inProcessPercent}%)
                                        </span>
                                    </div>
                                    <Progress value={inProcessPercent} className="h-2 bg-blue-100" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                            <span>Resolved</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {stats.resolved} ({resolvedPercent}%)
                                        </span>
                                    </div>
                                    <Progress value={resolvedPercent} className="h-2 bg-green-100" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                            <span>Rejected</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {stats.rejected} ({rejectedPercent}%)
                                        </span>
                                    </div>
                                    <Progress value={rejectedPercent} className="h-2 bg-red-100" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reports Trend Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Reports Received Over Time</CardTitle>
                                <CardDescription>Number of reports received per day</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportsByDay} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" angle={-45} textAnchor="end" tick={{ fontSize: 12 }} height={60} />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="count" name="Reports" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - 2/6 width */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Recent Reports with fixed minimum height */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Reports</CardTitle>
                                <CardDescription>Latest submitted reports</CardDescription>
                            </CardHeader>
                            <CardContent className="max-h-[180px] min-h-[180px] overflow-y-auto">
                                <div className="space-y-4">
                                    {recentReports.length === 0 ? (
                                        <div className="text-muted-foreground py-6 text-center">No reports have been submitted yet</div>
                                    ) : (
                                        <div className="divide-y">
                                            {recentReports.map((report) => (
                                                <div key={report.report_id} className="py-3">
                                                    <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                        <Link
                                                            href={route('admin.reports.show', report.report_id)}
                                                            className="line-clamp-1 font-medium hover:underline"
                                                        >
                                                            {report.title}
                                                        </Link>
                                                        <StatusBadge status={report.status} />
                                                    </div>
                                                    <div className="text-muted-foreground flex flex-wrap items-center justify-between text-xs">
                                                        <div className="line-clamp-1">By {report.user.name}</div>
                                                        <Badge variant="outline" className="mt-1 sm:mt-0">
                                                            {report.category.category_name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" size="sm" asChild className="w-full">
                                    <Link href={route('admin.reports.index')}>
                                        View All Reports
                                        <ArrowUpRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Categories Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Reports by Category</CardTitle>
                                <CardDescription>Distribution across categories</CardDescription>
                            </CardHeader>
                            <CardContent className="px-2">
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <div
                                            key={category.category_id}
                                            className="hover:bg-accent flex items-center justify-between rounded-lg px-3 py-2"
                                        >
                                            <span className="truncate">{category.category_name}</span>
                                            <Badge variant="secondary">{category.reports_count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" size="sm" asChild className="w-full">
                                    <Link href={'/'}>
                                        Manage Categories
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
