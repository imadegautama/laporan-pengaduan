import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

interface User {
    user_id?: number;
    name: string;
    email: string;
    role: string;
    email_verified_at?: string | null;
}

interface UserFormProps {
    user?: User;
    isEditing: boolean;
}

export default function UserForm({ user, isEditing }: UserFormProps) {
    const { data, setData, post, put, errors, processing, reset } = useForm({
        user_id: user?.user_id,
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'USER',
        email_verified_at: user?.email_verified_at || null,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('admin.users.update', user?.user_id));
        } else {
            post(route('admin.users.store'));
        }
    };

    // Reset the form when the user prop changes
    useEffect(() => {
        if (user) {
            reset();
            setData({
                user_id: user!.user_id!,
                name: user.name!,
                email: user.email!,
                role: user.role!,
                email_verified_at: user.email_verified_at!,
                password: '',
                password_confirmation: '',
            });
        }
    }, [user]);

    return (
        <AppLayout>
            <Head title={isEditing ? `Edit User: ${user?.name}` : 'Create New User'} />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">{isEditing ? `Edit User: ${user?.name}` : 'Create New User'}</h1>
                    <p className="text-muted-foreground mt-1">{isEditing ? 'Update user information' : 'Add a new user to the system'}</p>
                </div>

                <Card className="max-w-2xl">
                    <form onSubmit={submit}>
                        <CardHeader>
                            <CardTitle>{isEditing ? 'Edit User' : 'New User'}</CardTitle>
                        </CardHeader>
                        <CardContent className="my-4 space-y-6">
                            {/* Name Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="required">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter full name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    required
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>

                            {/* Email Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="required">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    required
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>

                            {/* Password Fields - Only shown for new users */}
                            {!isEditing && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="required">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            required
                                        />
                                        {errors.password && <InputError message={errors.password} />}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="required">
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            placeholder="Confirm password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {/* User Role */}
                            <div className="grid gap-2">
                                <Label className="required">Role</Label>
                                <RadioGroup
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                    disabled={processing}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="USER" id="user-role" />
                                        <Label htmlFor="user-role" className="cursor-pointer">
                                            User
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ADMIN" id="admin-role" />
                                        <Label htmlFor="admin-role" className="cursor-pointer">
                                            Admin
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {errors.role && <InputError message={errors.role} />}
                            </div>

                            {/* Email Verification Status - Only shown for existing users */}
                            {/* {isEditing && (
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="verified">Email Verified</Label>
                                        <Switch
                                            id="verified"
                                            checked={!!data.email_verified_at}
                                            onCheckedChange={(checked) => setData('email_verified_at', checked ? new Date().toISOString() : null)}
                                            disabled={processing}
                                        />
                                    </div>
                                    <p className="text-muted-foreground text-sm">Toggle whether this user's email is considered verified.</p>
                                </div>
                            )} */}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                {isEditing ? 'Update User' : 'Create User'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
