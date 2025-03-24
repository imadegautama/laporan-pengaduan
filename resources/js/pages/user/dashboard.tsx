import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, FilePlus, FileText } from 'lucide-react';

interface Category {
    category_id: number;
    category_name: string;
}

interface Report {
    report_id: number;
    title: string;
    description: string;
    category: Category;
    image: string;
    status: 'PENDING' | 'IN_PROCESS' | 'RESOLVED' | 'REJECTED';
    created_at: string;
    updated_at: string;
}

interface DashboardProps {
    recentReports: Report[];
    reportsCount: {
        total: number;
        pending: number;
        in_process: number;
        resolved: number;
    };
}

export default function UserDashboard({ recentReports, reportsCount }: DashboardProps) {
    const getStatusBadge = (status: string) => {
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="User Dashboard" />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6 flex flex-col gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
                    <p className="text-muted-foreground">Welcome to the Public Complaint System</p>
                </div>

                {/* Statistics row */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="flex flex-col items-center p-4">
                            <div className="text-muted-foreground text-sm font-medium">Total Reports</div>
                            <div className="mt-1 text-3xl font-bold">{reportsCount.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center p-4">
                            <div className="text-muted-foreground text-sm font-medium">Pending</div>
                            <div className="mt-1 text-3xl font-bold text-yellow-500">{reportsCount.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center p-4">
                            <div className="text-muted-foreground text-sm font-medium">In Process</div>
                            <div className="mt-1 text-3xl font-bold text-blue-500">{reportsCount.in_process}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center p-4">
                            <div className="text-muted-foreground text-sm font-medium">Resolved</div>
                            <div className="mt-1 text-3xl font-bold text-green-500">{reportsCount.resolved}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                <FilePlus className="text-primary h-6 w-6" />
                            </div>
                            <CardTitle>Submit New Report</CardTitle>
                            <CardDescription>Create a new complaint with details and supporting evidence</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href={route('reports.create')}>
                                <Button>Create Report</Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                <FileText className="text-primary h-6 w-6" />
                            </div>
                            <CardTitle>My Reports</CardTitle>
                            <CardDescription>View and track the status of all your submitted reports</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href={route('reports.index')}>
                                <Button variant="outline">View Reports</Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card className="md:col-span-2 xl:col-span-1 xl:row-span-2">
                        <CardHeader>
                            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                <Clock className="text-primary h-6 w-6" />
                            </div>
                            <CardTitle>Recent Reports</CardTitle>
                            <CardDescription>Your most recently submitted reports</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentReports.length === 0 ? (
                                <div className="text-muted-foreground py-4 text-center text-sm">No reports submitted yet</div>
                            ) : (
                                <div className="space-y-4">
                                    {recentReports.map((report) => (
                                        <div key={report.report_id} className="border-border flex items-start space-y-1 border-b pb-4 last:border-0">
                                            <div className="w-full">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <Link href={route('reports.show', report.report_id)} className="font-medium hover:underline">
                                                        {report.title}
                                                    </Link>
                                                    {getStatusBadge(report.status)}
                                                </div>

                                                <div className="mb-1 flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {report.category.category_name}
                                                    </Badge>
                                                    <div className="text-muted-foreground flex items-center text-xs">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        {formatDate(report.created_at)}
                                                    </div>
                                                </div>

                                                <p className="text-muted-foreground line-clamp-1 text-sm">{report.description}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-2 text-center">
                                        <Link href={route('reports.index')}>
                                            <Button variant="link" size="sm">
                                                View All Reports
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
