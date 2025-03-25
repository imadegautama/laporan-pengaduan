import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, FileText, MessageCircleWarning, ShieldCheck } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Public Complaint System" />

            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
                {/* Header */}
                <header className="border-b border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <MessageCircleWarning className="text-primary" />
                                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">CivicReport</span>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={auth.user.role === 'ADMIN' ? route('dashboard') : route('user.report.index')}
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                        >
                                            Log in
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button size="sm">Register</Button>
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
                            <div className="order-2 lg:order-1">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
                                    <span className="block">Your Voice,</span>
                                    <span className="text-primary block">Real Change</span>
                                </h1>
                                <p className="mt-6 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
                                    An online public complaint platform designed to help you report issues and get quick responses from authorities.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-4">
                                    <Link href={route('register')}>
                                        <Button size="lg">Submit Report</Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="order-1 flex justify-center lg:order-2">
                                <img src="/images/hero-img.svg" alt="Complaint System Illustration" className="w-full max-w-md" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white py-16 dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Key Features</h2>
                            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Easy, fast, and transparent complaint system</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                        <FileText className="text-primary h-6 w-6" />
                                    </div>
                                    <CardTitle>Easy Reporting</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        Submit your complaints easily through a simple form, with support for photos and documents.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                        <Clock className="text-primary h-6 w-6" />
                                    </div>
                                    <CardTitle>Quick Response</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        Each complaint is processed quickly and you will receive regular status updates.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                        <ShieldCheck className="text-primary h-6 w-6" />
                                    </div>
                                    <CardTitle>Privacy Guaranteed</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>Reporter identity is protected.</CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 dark:bg-gray-950">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">How It Works</h2>
                            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Follow these 4 simple steps to submit a complaint</p>
                        </div>

                        <div className="grid gap-12 md:grid-cols-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-primary relative mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white">
                                    <span className="text-xl font-bold">1</span>
                                </div>
                                <h3 className="mt-2 text-xl font-semibold dark:text-white">Register Account</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Create an account with your email and valid personal information
                                </p>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="bg-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white">
                                    <span className="text-xl font-bold">2</span>
                                </div>
                                <h3 className="mt-2 text-xl font-semibold dark:text-white">Write Complaint</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Fill out the complaint form completely and clearly</p>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="bg-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white">
                                    <span className="text-xl font-bold">3</span>
                                </div>
                                <h3 className="mt-2 text-xl font-semibold dark:text-white">Verification Process</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Your complaint will be verified by an administrator</p>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="bg-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white">
                                    <span className="text-xl font-bold">4</span>
                                </div>
                                <h3 className="mt-2 text-xl font-semibold dark:text-white">Get Response</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">You will receive follow-up notifications</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="bg-primary dark:bg-primary py-16">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mb-2 text-4xl font-bold text-white">2,500+</div>
                                <div className="text-lg font-medium text-white/80">Resolved Complaints</div>
                            </div>

                            <div className="text-center">
                                <div className="mb-2 text-4xl font-bold text-white">95%</div>
                                <div className="text-lg font-medium text-white/80">Satisfaction Rate</div>
                            </div>

                            <div className="text-center">
                                <div className="mb-2 text-4xl font-bold text-white">48 Hours</div>
                                <div className="text-lg font-medium text-white/80">Average Response Time</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="rounded-lg bg-gray-50 p-8 shadow-lg md:p-12 dark:bg-gray-800">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                    Ready to Submit a Complaint?
                                </h2>
                                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                                    Join thousands of citizens who have used our complaint service
                                </p>
                                <div className="mt-8">
                                    <Link href={route('register')}>
                                        <Button size="lg">Create Account Now</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
                    <div className="container mx-auto px-4 py-12 sm:px-6">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <div className="flex items-center">
                                    <MessageCircleWarning className="text-primary" />

                                    <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">CivicReport</span>
                                </div>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">A trusted and transparent online public complaint system.</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Links</h3>
                                <ul className="mt-4 space-y-2">
                                    <li>
                                        <a href="#" className="hover:text-primary text-gray-600 dark:text-gray-300">
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-primary text-gray-600 dark:text-gray-300">
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-primary text-gray-600 dark:text-gray-300">
                                            FAQ
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-primary text-gray-600 dark:text-gray-300">
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Legal</h3>
                                <ul className="mt-4 space-y-2">
                                    <li>
                                        <a href="#" className="hover:text-primary text-gray-600 dark:text-gray-300">
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-primary text-gray-600 dark:text-gray-300">
                                            Terms & Conditions
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Contact</h3>
                                <ul className="mt-4 space-y-2">
                                    <li className="text-gray-600 dark:text-gray-300">info@civicreport.com</li>
                                    <li className="text-gray-600 dark:text-gray-300">+1 234 567 890</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
                            <p className="text-center text-gray-600 dark:text-gray-300">
                                © {new Date().getFullYear()} CivicReport. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
