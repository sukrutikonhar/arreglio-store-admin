import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import {
    Users,
    Target,
    Heart,
    Zap,
    Shield,
    Star,
    CheckCircle,
    Globe
} from 'lucide-react';

const About: React.FC = () => {
    const teamMembers = [
        {
            id: 1,
            name: 'Sarah Johnson',
            position: 'CEO & Founder',
            image: '/images/avatar/user1.jpg',
            bio: '10+ years of experience in e-commerce and digital transformation',
            linkedin: '#',
            twitter: '#'
        },
        {
            id: 2,
            name: 'Michael Chen',
            position: 'CTO',
            image: '/images/avatar/user1.jpg',
            bio: 'Expert in scalable architecture and emerging technologies',
            linkedin: '#',
            twitter: '#'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            position: 'Head of Operations',
            image: '/images/avatar/user1.jpg',
            bio: 'Specialized in process optimization and customer experience',
            linkedin: '#',
            twitter: '#'
        },
        {
            id: 4,
            name: 'David Kim',
            position: 'Head of Marketing',
            image: '/images/avatar/user1.jpg',
            bio: 'Digital marketing expert with focus on growth strategies',
            linkedin: '#',
            twitter: '#'
        }
    ];

    const values = [
        {
            icon: <Heart className="w-8 h-8 text-red-500" />,
            title: 'Customer First',
            description: 'We prioritize customer satisfaction above everything else'
        },
        {
            icon: <Shield className="w-8 h-8 text-blue-500" />,
            title: 'Trust & Security',
            description: 'Your data and transactions are protected with enterprise-grade security'
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            title: 'Innovation',
            description: 'Constantly evolving and adopting the latest technologies'
        },
        {
            icon: <Users className="w-8 h-8 text-green-500" />,
            title: 'Team Excellence',
            description: 'Our diverse team brings together expertise from various domains'
        }
    ];

    const achievements = [
        { metric: '10,000+', label: 'Happy Customers', icon: <Users className="w-6 h-6" /> },
        { metric: '50,000+', label: 'Orders Processed', icon: <CheckCircle className="w-6 h-6" /> },
        { metric: '99.9%', label: 'Uptime', icon: <Shield className="w-6 h-6" /> },
        { metric: '4.8/5', label: 'Customer Rating', icon: <Star className="w-6 h-6" /> }
    ];

    const milestones = [
        {
            year: '2020',
            title: 'Company Founded',
            description: 'Started with a vision to revolutionize e-commerce management'
        },
        {
            year: '2021',
            title: 'First 1000 Customers',
            description: 'Reached our first major milestone with growing customer base'
        },
        {
            year: '2022',
            title: 'Series A Funding',
            description: 'Secured $5M in funding to accelerate product development'
        },
        {
            year: '2023',
            title: 'International Expansion',
            description: 'Launched services in 5 new countries across Europe and Asia'
        },
        {
            year: '2024',
            title: 'AI Integration',
            description: 'Introduced AI-powered features for enhanced user experience'
        }
    ];

    return (
        <div className="p-6">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">About Arreglio Admin</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We're on a mission to empower businesses with powerful, intuitive, and scalable
                    e-commerce management solutions that drive growth and success.
                </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <Card className="h-full">
                    <div className="text-center">
                        <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
                        <p className="text-gray-600">
                            To provide businesses with the most comprehensive and user-friendly e-commerce
                            management platform that streamlines operations, enhances customer experience,
                            and drives sustainable growth.
                        </p>
                    </div>
                </Card>

                <Card className="h-full">
                    <div className="text-center">
                        <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
                        <p className="text-gray-600">
                            To become the global leader in e-commerce management solutions, empowering
                            millions of businesses to succeed in the digital economy through innovative
                            technology and exceptional service.
                        </p>
                    </div>
                </Card>
            </div>

            {/* Values */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <Card key={index} className="text-center">
                            <div className="mb-4">{value.icon}</div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h4>
                            <p className="text-gray-600 text-sm">{value.description}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-12">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Our Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="text-center text-white">
                            <div className="flex justify-center mb-2">{achievement.icon}</div>
                            <div className="text-3xl font-bold mb-1">{achievement.metric}</div>
                            <div className="text-sm opacity-90">{achievement.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Journey</h2>
                <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>
                    <div className="space-y-8">
                        {milestones.map((milestone, index) => (
                            <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className="w-1/2 px-8">
                                    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                        <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h4>
                                        <p className="text-gray-600">{milestone.description}</p>
                                    </div>
                                </div>
                                <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                                <div className="w-1/2 px-8"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Meet Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((member) => (
                        <Card key={member.id} className="text-center">
                            <div className="mb-4">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto object-cover"
                                />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h4>
                            <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                            <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                            <div className="flex justify-center gap-2">
                                <Button
                                    icon="pi pi-linkedin"
                                    className="p-button-text p-button-sm"
                                    onClick={() => window.open(member.linkedin, '_blank')}
                                />
                                <Button
                                    icon="pi pi-twitter"
                                    className="p-button-text p-button-sm"
                                    onClick={() => window.open(member.twitter, '_blank')}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Technology Stack */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Technology Stack</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Frontend</h4>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>React</span>
                                    <span>95%</span>
                                </div>
                                <ProgressBar value={95} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>TypeScript</span>
                                    <span>90%</span>
                                </div>
                                <ProgressBar value={90} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Tailwind CSS</span>
                                    <span>85%</span>
                                </div>
                                <ProgressBar value={85} className="h-2" />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Backend</h4>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Node.js</span>
                                    <span>90%</span>
                                </div>
                                <ProgressBar value={90} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Python</span>
                                    <span>80%</span>
                                </div>
                                <ProgressBar value={80} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>PostgreSQL</span>
                                    <span>85%</span>
                                </div>
                                <ProgressBar value={85} className="h-2" />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Cloud & DevOps</h4>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>AWS</span>
                                    <span>88%</span>
                                </div>
                                <ProgressBar value={88} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Docker</span>
                                    <span>85%</span>
                                </div>
                                <ProgressBar value={85} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Kubernetes</span>
                                    <span>75%</span>
                                </div>
                                <ProgressBar value={75} className="h-2" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Join thousands of businesses that trust Arreglio Admin to manage their e-commerce operations.
                    Start your free trial today and experience the difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        label="Start Free Trial"
                        icon="pi pi-play"
                        className="p-button-lg"
                    />
                    <Button
                        label="Contact Sales"
                        icon="pi pi-phone"
                        className="p-button-outlined p-button-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default About; 