import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useState } from 'react';

interface Category {
    category_id: number;
    category_name: string;
    description?: string;
}

interface ReportFormProps {
    categories: Category[];
}

export default function ReportForm({ categories }: ReportFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category_id: '',
        image: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('reports.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Submit Report" />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6 flex flex-col gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">Submit Report</h1>
                    <p className="text-muted-foreground">Provide details about your complaint</p>
                </div>

                <Card className="mb-2 max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="mb-5">
                            <CardTitle>Report Details</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Title <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Brief summary of your complaint"
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id">
                                    Category <span className="text-destructive">*</span>
                                </Label>
                                <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.category_id} value={category.category_id.toString()}>
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Provide detailed information about your complaint"
                                    rows={5}
                                    required
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">
                                    Evidence Image <span className="text-destructive">*</span>
                                </Label>
                                <Input id="image" type="file" onChange={handleImageChange} accept="image/jpeg,image/png,image/jpg" required />
                                <p className="text-muted-foreground text-xs">Upload a clear image related to your complaint (Max: 2MB)</p>
                                <InputError message={errors.image} />

                                {preview && (
                                    <div className="mt-4">
                                        <p className="mb-2 text-sm font-medium">Image Preview:</p>
                                        <img src={preview} alt="Preview" className="border-border h-auto max-h-64 max-w-full rounded-md border" />
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="mt-4 flex justify-between">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit Report'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
