import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle2, Clock, HandCoins, Mail, MessageCircle, User, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Category {
    category_id: number;
    category_name: string;
    description?: string;
}

interface User {
    user_id: number;
    name: string;
    email: string;
    role?: string;
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
    user: User;
    image: string;
    status: 'PENDING' | 'IN_PROCESS' | 'RESOLVED' | 'REJECTED';
    created_at: string;
    updated_at: string;
    responses: Response[];
}

interface ReportDetailProps {
    report: Report;
}

export default function AdminReportDetail({ report }: ReportDetailProps) {
    const [imageModalOpen, setImageModalOpen] = useState(false);

    // Form for status update
    const statusForm = useForm({
        status: report.status,
    });

    // Form for adding responses
    const responseForm = useForm({
        message: '',
    });

    const handleStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        statusForm.patch(route('admin.reports.status', report.report_id), {
            method: 'patch',
            preserveScroll: true,
            onSuccess: () => {
                // Nothing needed here as we're preserving scroll
            },
        });
    };

    const handleResponseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        responseForm.post(route('admin.reports.responses.store', report.report_id), {
            preserveScroll: true,
            onSuccess: () => {
                responseForm.reset('message');
            },
        });
    };

    // const getStatusIcon = (status: Report['status']) => {
    //     switch (status) {
    //         case 'PENDING':
    //             return <Clock className="h-5 w-5 text-yellow-500" />;
    //         case 'IN_PROCESS':
    //             return <HandCoins className="h-5 w-5 text-blue-500" />;
    //         case 'RESOLVED':
    //             return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    //         case 'REJECTED':
    //             return <XCircle className="h-5 w-5 text-red-500" />;
    //     }
    // };

    const getStatusBadge = (status: Report['status']) => {
        switch (status) {
            case 'PENDING':
                return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">PENDING</Badge>;
            case 'IN_PROCESS':
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">IN PROCESS</Badge>;
            case 'RESOLVED':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">RESOLVED</Badge>;
            case 'REJECTED':
                return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">REJECTED</Badge>;
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

    return (
        <AppLayout>
            <Head title={`Report #${report.report_id}`} />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <Link
                        href={route('admin.reports.index')}
                        className="text-muted-foreground hover:text-foreground mb-4 flex items-center transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Reports List
                    </Link>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Report #{report.report_id}</h1>
                            <div className="text-muted-foreground mt-1 flex text-sm">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>Submitted on {formatDate(report.created_at)}</span>
                            </div>
                        </div>
                        <div>{getStatusBadge(report.status)}</div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content - 2/3 width on large screens */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Report Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span>{report.title}</span>
                                </CardTitle>
                                <Badge variant="outline">{report.category.category_name}</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap">{report.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Evidence Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Evidence Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="cursor-pointer overflow-hidden rounded-md border" onClick={() => setImageModalOpen(true)}>
                                    <img src={`/storage/${report.image}`} alt="Report Evidence" className="max-h-96 w-full object-contain" />
                                </div>
                                <div className="text-muted-foreground mt-2 text-sm">Click on the image to view full size</div>
                            </CardContent>
                        </Card>

                        {/* Update Status Form */}
                        <form onSubmit={handleStatusSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Update Status</CardTitle>
                                    <CardDescription>Change the status of this report</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={statusForm.data.status}
                                        onValueChange={(value) => statusForm.setData('status', value as Report['status'])}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <div>
                                            <RadioGroupItem value="PENDING" id="status-pending" className="peer sr-only" />
                                            <Label
                                                htmlFor="status-pending"
                                                className="border-muted flex cursor-pointer flex-col items-center justify-between rounded-md border-2 bg-yellow-50 p-4 peer-data-[state=checked]:border-yellow-500 hover:bg-yellow-100 hover:text-yellow-900 [&:has([data-state=checked])]:border-yellow-500"
                                            >
                                                <Clock className="mb-2 h-6 w-6 text-yellow-600" />
                                                <span className="font-medium text-yellow-800">Pending</span>
                                                <span className="text-muted-foreground text-center text-xs">Awaiting review</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="IN_PROCESS" id="status-process" className="peer sr-only" />
                                            <Label
                                                htmlFor="status-process"
                                                className="border-muted flex cursor-pointer flex-col items-center justify-between rounded-md border-2 bg-blue-50 p-4 peer-data-[state=checked]:border-blue-500 hover:bg-blue-100 hover:text-blue-900 [&:has([data-state=checked])]:border-blue-500"
                                            >
                                                <HandCoins className="mb-2 h-6 w-6 text-blue-600" />
                                                <span className="font-medium text-blue-800">In Process</span>
                                                <span className="text-muted-foreground text-center text-xs">Being addressed</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="RESOLVED" id="status-resolved" className="peer sr-only" />
                                            <Label
                                                htmlFor="status-resolved"
                                                className="border-muted flex cursor-pointer flex-col items-center justify-between rounded-md border-2 bg-green-50 p-4 peer-data-[state=checked]:border-green-500 hover:bg-green-100 hover:text-green-900 [&:has([data-state=checked])]:border-green-500"
                                            >
                                                <CheckCircle2 className="mb-2 h-6 w-6 text-green-600" />
                                                <span className="font-medium text-green-800">Resolved</span>
                                                <span className="text-muted-foreground text-center text-xs">Issue fixed</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="REJECTED" id="status-rejected" className="peer sr-only" />
                                            <Label
                                                htmlFor="status-rejected"
                                                className="border-muted flex cursor-pointer flex-col items-center justify-between rounded-md border-2 bg-red-50 p-4 peer-data-[state=checked]:border-red-500 hover:bg-red-100 hover:text-red-900 [&:has([data-state=checked])]:border-red-500"
                                            >
                                                <XCircle className="mb-2 h-6 w-6 text-red-600" />
                                                <span className="font-medium text-red-800">Rejected</span>
                                                <span className="text-muted-foreground text-center text-xs">Not actionable</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button type="submit" disabled={statusForm.processing || statusForm.data.status === report.status}>
                                        {statusForm.processing ? 'Updating...' : 'Update Status'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>

                        {/* Responses Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Responses ({report.responses.length})
                                </CardTitle>
                                <CardDescription>Responses to this report from admin and users</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {report.responses.length === 0 ? (
                                        <div className="text-muted-foreground py-8 text-center">No responses yet</div>
                                    ) : (
                                        report.responses.map((response) => (
                                            <div key={response.response_id} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center font-medium">
                                                            {response.user.name}
                                                            {response.user.role === 'ADMIN' && (
                                                                <Badge variant="secondary" className="ml-2">
                                                                    Admin
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-muted-foreground text-xs">{formatDate(response.created_at)}</div>
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">{response.message}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <form onSubmit={handleResponseSubmit} className="w-full">
                                    <div className="space-y-4">
                                        <Textarea
                                            id="message"
                                            placeholder="Add your response..."
                                            value={responseForm.data.message}
                                            onChange={(e) => responseForm.setData('message', e.target.value)}
                                            className="min-h-[100px]"
                                            required
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={responseForm.processing}>
                                                {responseForm.processing ? 'Sending...' : 'Add Response'}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 width on large screens */}
                    <div className="space-y-6">
                        {/* Reporter Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Reporter Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{report.user.name}</div>
                                        <div className="text-muted-foreground text-sm">User ID: {report.user.user_id}</div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <div className="mb-2 flex items-center text-sm">
                                        <Mail className="mr-2 h-4 w-4" />
                                        <span className="text-muted-foreground">Email</span>
                                    </div>
                                    <div>{report.user.email}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Report Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Report Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-muted-foreground mb-1 text-sm">Report ID</div>
                                    <div className="font-mono">{report.report_id}</div>
                                </div>

                                <Separator />

                                <div>
                                    <div className="text-muted-foreground mb-1 text-sm">Status</div>
                                    <div className="flex items-center">{getStatusBadge(report.status)}</div>
                                </div>

                                <Separator />

                                <div>
                                    <div className="text-muted-foreground mb-1 text-sm">Category</div>
                                    <div>
                                        <Badge variant="outline">{report.category.category_name}</Badge>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <div className="mb-1 flex items-center text-sm">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span className="text-muted-foreground">Submitted On</span>
                                    </div>
                                    <div>{formatDate(report.created_at)}</div>
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center text-sm">
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span className="text-muted-foreground">Last Updated</span>
                                    </div>
                                    <div>{formatDate(report.updated_at)}</div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={route('admin.reports.index')}>Back to All Reports</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Full screen image modal */}
            {imageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setImageModalOpen(false)}>
                    <div className="max-h-full max-w-4xl">
                        <img src={`/storage/${report.image}`} alt="Report Evidence" className="max-h-[90vh] max-w-full object-contain" />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
