import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';

interface Category {
    category_id: number;
    category_name: string;
}

interface User {
    user_id: number;
    name: string;
    role: string;
}

interface Response {
    response_id: number;
    report_id: number;
    user_id: number;
    message: string;
    created_at: string;
    updated_at: string;
    user: User;
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
    responses: Response[];
}

interface ReportShowProps {
    report: Report;
}

export default function ReportShow({ report }: ReportShowProps) {
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get user initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <AppLayout>
            <Head title={`Report: ${report.title}`} />

            <div className="container mx-auto px-4 py-6">
                <Link
                    href={route('user.report.index')}
                    className="text-muted-foreground hover:text-foreground mb-6 flex items-center transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Reports
                </Link>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <Card className="mb-6">
                            <CardHeader className="relative">
                                <div className="absolute top-6 right-6">
                                    <Badge className={getStatusColor(report.status)}>{report.status.replace('_', ' ')}</Badge>
                                </div>
                                <div className="mb-2">
                                    <Badge variant="outline">{report.category.category_name}</Badge>
                                </div>
                                <CardTitle className="text-2xl">{report.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="mb-2 text-lg font-semibold">Description</h3>
                                    <div className="whitespace-pre-wrap">{report.description}</div>
                                </div>

                                <div>
                                    <h3 className="mb-2 text-lg font-semibold">Evidence Image</h3>
                                    <div className="overflow-hidden rounded-md">
                                        <img src={`/storage/${report.image}`} alt="Report Evidence" className="w-full object-cover" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Responses */}
                        <Card>
                            <CardHeader className="flex flex-row items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Responses
                                </CardTitle>
                                <Badge variant="outline" className="ml-2">
                                    {report.responses?.length || 0}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                {!report.responses || report.responses.length === 0 ? (
                                    <div className="bg-muted/50 flex items-center justify-center rounded-md p-8 text-center">
                                        <div className="text-muted-foreground">
                                            <p>No responses yet.</p>
                                            <p className="text-sm">Admin responses will appear here once they respond to your report.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {report.responses.map((response) => (
                                            <div key={response.response_id} className="space-y-2">
                                                <div className="flex items-start gap-3">
                                                    <Avatar>
                                                        <AvatarFallback
                                                            className={response.user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100'}
                                                        >
                                                            {getInitials(response.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                                                            <div className="font-medium">
                                                                {response.user.name}
                                                                {response.user.role === 'ADMIN' && (
                                                                    <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                                        Admin
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <span className="text-muted-foreground text-xs sm:ml-2">
                                                                {formatDate(response.created_at)}
                                                            </span>
                                                        </div>
                                                        <div className="bg-muted rounded-md p-3 whitespace-pre-wrap">{response.message}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Report Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-muted-foreground text-sm font-medium">Status</div>
                                    <div className="mt-1">
                                        <Badge className={getStatusColor(report.status)}>{report.status.replace('_', ' ')}</Badge>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground text-sm font-medium">Category</div>
                                    <div className="mt-1">{report.category.category_name}</div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground flex items-center text-sm font-medium">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        Created
                                    </div>
                                    <div className="mt-1">{formatDate(report.created_at)}</div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground flex items-center text-sm font-medium">
                                        <Clock className="mr-1 h-4 w-4" />
                                        Last Updated
                                    </div>
                                    <div className="mt-1">{formatDate(report.updated_at)}</div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground flex items-center text-sm font-medium">
                                        <MessageCircle className="mr-1 h-4 w-4" />
                                        Responses
                                    </div>
                                    <div className="mt-1">{report.responses?.length || 0}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
