import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { ICategory } from '@/types/category';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface CategoryFormPageProps {
    updateData?: ICategory;
}

function CategoryFormPage({ updateData }: CategoryFormPageProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        category_name: updateData?.category_name ?? '',
        description: updateData?.description ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (updateData?.category_id) {
            put(`/admin/categories/${updateData?.category_id}`);
        } else {
            post('/admin/categories');
        }
    };

    return (
        <AppLayout>
            <Head title="Categories" />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    {!updateData ? (
                        <>
                            <h1 className="text-3xl font-bold tracking-tight">Create Category</h1>
                            <p className="text-muted-foreground mt-1 text-sm">Add a new category for reports</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold tracking-tight">Update Category</h1>
                            <p className="text-muted-foreground mt-1 text-sm">Update category for reports</p>
                        </>
                    )}
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category_name">
                                    Category Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="category_name"
                                    value={data.category_name}
                                    onChange={(e) => setData('category_name', e.target.value)}
                                    placeholder="Enter category name"
                                />
                                <InputError message={errors.category_name} className="mt-2" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter category description"
                                    rows={5}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>
                        </CardContent>
                        <CardFooter className="mt-5 flex justify-between">
                            <Button type="button" variant="outline" onClick={() => router.visit('/admin/categories')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

export default CategoryFormPage;
