import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Mail, Star, Users, Shield, Zap } from 'lucide-react';

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: <Zap className="w-6 h-6" />,
        title: 'Lightning Fast',
        description: 'Optimized performance for instant loading and smooth interactions'
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: 'Enterprise Security',
        description: 'Bank-level security with advanced encryption and compliance'
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: 'Team Collaboration',
        description: 'Real-time collaboration tools for seamless team workflows'
    },
    {
        icon: <Star className="w-6 h-6" />,
        title: 'Premium Features',
        description: 'Advanced analytics, custom integrations, and priority support'
    }
];

export default function ComingSoon() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);

    // Mock launch date (30 days from now)
    const launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const [timeLeft, setTimeLeft] = useState({
        days: 30,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Countdown timer
    useState(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate.getTime() - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(timer);
    });

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter your email address',
                life: 3000
            });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid email address',
                life: 3000
            });
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsSubscribed(true);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'You\'ve been added to our waitlist! We\'ll notify you when we launch.',
                life: 5000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to subscribe. Please try again.',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <Toast ref={toast} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-8">
                        <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Something Amazing is
                        <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Coming Soon
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        We're building the next generation of admin tools. Get ready for a revolutionary experience
                        that will transform how you manage your business.
                    </p>

                    {/* Countdown Timer */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto mb-12">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="text-3xl font-bold text-gray-900">{timeLeft.days}</div>
                            <div className="text-sm text-gray-500">Days</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="text-3xl font-bold text-gray-900">{timeLeft.hours}</div>
                            <div className="text-sm text-gray-500">Hours</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="text-3xl font-bold text-gray-900">{timeLeft.minutes}</div>
                            <div className="text-sm text-gray-500">Minutes</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="text-3xl font-bold text-gray-900">{timeLeft.seconds}</div>
                            <div className="text-sm text-gray-500">Seconds</div>
                        </div>
                    </div>
                </div>

                {/* Email Signup */}
                <div className="max-w-md mx-auto mb-16">
                    {!isSubscribed ? (
                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <InputText
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full pl-10"
                                    type="email"
                                />
                            </div>
                            <Button
                                type="submit"
                                label="Notify Me When It's Ready"
                                icon="pi pi-bell"
                                className="w-full"
                                loading={isLoading}
                            />
                        </form>
                    ) : (
                        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-green-900 mb-2">You're on the list!</h3>
                            <p className="text-green-700">We'll notify you as soon as we launch.</p>
                        </div>
                    )}
                </div>

                {/* Features Preview */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        What to Expect
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                                <div className="mx-auto h-12 w-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <div className="text-purple-600">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Development Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                            <div className="text-sm text-gray-600">Core Features</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">70%</div>
                            <div className="text-sm text-gray-600">UI/UX Design</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">60%</div>
                            <div className="text-sm text-gray-600">Testing & QA</div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Follow Our Journey</h3>
                    <div className="flex justify-center space-x-6">
                        <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 text-sm">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                    <p className="mt-2">
                        Questions? Contact us at{' '}
                        <a href="mailto:hello@example.com" className="text-purple-600 hover:text-purple-500">
                            hello@example.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
} 