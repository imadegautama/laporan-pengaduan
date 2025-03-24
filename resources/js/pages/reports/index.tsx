import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Eye, FilePlus } from 'lucide-react';

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

interface ReportsIndexProps {
    reports: Report[];
}

export default function ReportsIndex({ reports }: ReportsIndexProps) {
    const getStatusColor = (status: Report['status']) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'IN_PROCESS':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'RESOLVED':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return '';
        }
    };

    return (
        <AppLayout>
            <Head title="My Reports" />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
                        <p className="text-muted-foreground mt-1 text-sm">View and manage your submitted reports</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Link href={route('reports.create')}>
                            <Button>
                                <FilePlus className="mr-2 h-4 w-4" />
                                New Report
                            </Button>
                        </Link>
                    </div>
                </div>

                {reports.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="bg-muted rounded-full p-4">
                                <FilePlus className="text-muted-foreground h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">No reports yet</h3>
                            <p className="text-muted-foreground mt-2 max-w-md text-center">
                                You haven't submitted any reports yet. Create a new report to get started.
                            </p>
                            <Link href={route('reports.create')} className="mt-6">
                                <Button>Create Your First Report</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {reports.map((report) => (
                            <Card key={report.report_id}>
                                <CardHeader className="relative pb-0">
                                    <div className="absolute top-6 right-6">
                                        <Badge className={getStatusColor(report.status)}>{report.status.replace('_', ' ')}</Badge>
                                    </div>
                                    <div className="mb-2">
                                        <Badge variant="outline">{report.category.category_name}</Badge>
                                    </div>
                                    <CardTitle className="line-clamp-1">{report.title}</CardTitle>
                                    <CardDescription>Submitted on {new Date(report.created_at).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div
                                        className="mb-4 h-32 w-full overflow-hidden rounded-md bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(/storage/${report.image})`,
                                        }}
                                    />
                                    <p className="text-muted-foreground line-clamp-3 text-sm">{report.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href={route('reports.show', report.report_id)}>
                                        <Button variant="secondary" className="w-full">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
