export default function TermsConditions() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
                    <p className="text-lg text-gray-600">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 mb-4">
                                By accessing and using our service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                            <p className="text-gray-700">
                                These terms apply to all visitors, users, and others who access or use the service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                            <p className="text-gray-700 mb-4">
                                Our service provides administrative tools and management solutions for businesses. The service includes but is not limited to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Order management and tracking</li>
                                <li>Customer relationship management</li>
                                <li>Team collaboration tools</li>
                                <li>Analytics and reporting</li>
                                <li>Invoice and payment processing</li>
                                <li>Communication and notification systems</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                            <h3 className="text-xl font-medium text-gray-900 mb-3">3.1 Account Creation</h3>
                            <p className="text-gray-700 mb-4">
                                To use certain features of our service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">3.2 Account Security</h3>
                            <p className="text-gray-700 mb-4">
                                You are responsible for safeguarding the password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">3.3 Account Termination</h3>
                            <p className="text-gray-700 mb-4">
                                We may terminate or suspend your account immediately, without prior notice, for any reason, including breach of these Terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
                            <p className="text-gray-700 mb-4">You agree not to use the service to:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe upon the rights of others</li>
                                <li>Transmit harmful, offensive, or inappropriate content</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt the service</li>
                                <li>Use the service for any illegal or unauthorized purpose</li>
                                <li>Attempt to reverse engineer or decompile the service</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
                            <h3 className="text-xl font-medium text-gray-900 mb-3">5.1 Pricing</h3>
                            <p className="text-gray-700 mb-4">
                                Service pricing is subject to change with notice. All fees are non-refundable except as required by law.
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">5.2 Billing</h3>
                            <p className="text-gray-700 mb-4">
                                Billing occurs on a recurring basis. You authorize us to charge your payment method for all fees associated with your account.
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">5.3 Late Payments</h3>
                            <p className="text-gray-700 mb-4">
                                Late payments may result in service suspension or termination. We reserve the right to charge late fees and interest on overdue amounts.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
                            <p className="text-gray-700 mb-4">
                                The service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                            </p>
                            <p className="text-gray-700 mb-4">
                                You retain ownership of any content you submit to the service, but you grant us a license to use, modify, and distribute such content as necessary to provide the service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
                            <p className="text-gray-700 mb-4">
                                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
                            </p>
                            <p className="text-gray-700">
                                We implement appropriate security measures to protect your data, but no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability</h2>
                            <p className="text-gray-700 mb-4">
                                We strive to maintain high service availability but do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or other factors beyond our control.
                            </p>
                            <p className="text-gray-700">
                                We are not liable for any damages resulting from service interruptions or downtime.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                            <p className="text-gray-700 mb-4">
                                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                            <p className="text-gray-700">
                                Our total liability to you for any claims arising from the use of our service shall not exceed the amount paid by you for the service in the twelve months preceding the claim.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
                            <p className="text-gray-700 mb-4">
                                You agree to defend, indemnify, and hold harmless us and our affiliates from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the service or violation of these terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Disclaimers</h2>
                            <p className="text-gray-700 mb-4">
                                The service is provided "as is" and "as available" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Warranties of merchantability and fitness for a particular purpose</li>
                                <li>Warranties that the service will be uninterrupted or error-free</li>
                                <li>Warranties regarding the accuracy or reliability of any information</li>
                                <li>Warranties that defects will be corrected</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
                            <p className="text-gray-700 mb-4">
                                These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
                            </p>
                            <p className="text-gray-700">
                                Any disputes arising from these terms or the use of our service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization].
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
                            <p className="text-gray-700 mb-4">
                                We reserve the right to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                            </p>
                            <p className="text-gray-700">
                                Your continued use of the service after any changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Severability</h2>
                            <p className="text-gray-700 mb-4">
                                If any provision of these terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about these Terms and Conditions, please contact us:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> legal@example.com<br />
                                    <strong>Address:</strong> 123 Legal Street, Compliance City, CC 12345<br />
                                    <strong>Phone:</strong> +1 (555) 987-6543
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <a
                        href="/privacy"
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                        View Privacy Policy
                    </a>
                </div>
            </div>
        </div>
    );
} 