export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-gray-600">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-700 mb-4">
                                Welcome to our Privacy Policy. This document explains how we collect, use, and protect your personal information when you use our service.
                            </p>
                            <p className="text-gray-700">
                                We are committed to protecting your privacy and ensuring the security of your personal data. This policy outlines our practices regarding the collection, use, and disclosure of information.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                            <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Personal Information</h3>
                            <p className="text-gray-700 mb-4">We may collect the following personal information:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Name and contact information (email, phone number)</li>
                                <li>Account credentials and profile information</li>
                                <li>Payment and billing information</li>
                                <li>Usage data and preferences</li>
                                <li>Communication records and support interactions</li>
                            </ul>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Technical Information</h3>
                            <p className="text-gray-700 mb-4">We automatically collect certain technical information:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>IP address and device information</li>
                                <li>Browser type and version</li>
                                <li>Operating system and platform</li>
                                <li>Usage patterns and analytics data</li>
                                <li>Cookies and similar technologies</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-4">We use the collected information for the following purposes:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Provide and maintain our services</li>
                                <li>Process transactions and payments</li>
                                <li>Send notifications and updates</li>
                                <li>Improve our services and user experience</li>
                                <li>Provide customer support</li>
                                <li>Comply with legal obligations</li>
                                <li>Prevent fraud and ensure security</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
                            <p className="text-gray-700 mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>With your explicit consent</li>
                                <li>To comply with legal requirements</li>
                                <li>To protect our rights and safety</li>
                                <li>With trusted service providers (under strict confidentiality agreements)</li>
                                <li>In connection with business transfers or mergers</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                            <p className="text-gray-700 mb-4">We implement appropriate security measures to protect your personal information:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments and updates</li>
                                <li>Access controls and authentication</li>
                                <li>Secure data centers and infrastructure</li>
                                <li>Employee training on data protection</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                                <li><strong>Objection:</strong> Object to processing of your data</li>
                                <li><strong>Restriction:</strong> Limit how we process your data</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
                            <p className="text-gray-700 mb-4">We use cookies and similar technologies to:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Remember your preferences and settings</li>
                                <li>Analyze website usage and performance</li>
                                <li>Provide personalized content and features</li>
                                <li>Ensure security and prevent fraud</li>
                            </ul>
                            <p className="text-gray-700">
                                You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
                            <p className="text-gray-700 mb-4">
                                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. The retention period depends on the type of data and its purpose.
                            </p>
                            <p className="text-gray-700">
                                When we no longer need your information, we will securely delete or anonymize it.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Transfers</h2>
                            <p className="text-gray-700 mb-4">
                                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
                            <p className="text-gray-700 mb-4">
                                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
                            <p className="text-gray-700 mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.
                            </p>
                            <p className="text-gray-700">
                                Your continued use of our service after any changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> privacy@example.com<br />
                                    <strong>Address:</strong> 123 Privacy Street, Security City, SC 12345<br />
                                    <strong>Phone:</strong> +1 (555) 123-4567
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <a
                        href="/terms"
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                        View Terms and Conditions
                    </a>
                </div>
            </div>
        </div>
    );
} 