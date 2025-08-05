import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import WebsiteSettings from "../pages/WebsiteSettings";
import GeneralSettings from "../pages/GeneralSettings";
import FinancialSettings from "../pages/FinancialSettings";
import StorePage from '../pages/StorePage';
import Overview from '../pages/Overview';
import OrderDetails from '../pages/OrderDetails';
import OrderDetailsEnhanced from '../pages/OrderDetailsEnhanced';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// Authentication pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// User management pages
import Profile from '../pages/Profile';
import ServiceTeam from '../pages/ServiceTeam';
import CustomersList from '../pages/CustomersList';

// Invoice and order management
import CreateInvoice from '../pages/CreateInvoice';
import InvoiceDetails from '../pages/InvoiceDetails';

// System pages
import NotFound from '../pages/errors/NotFound';
import ServerError from '../pages/errors/ServerError';
import Offline from '../pages/errors/Offline';
import Maintenance from '../pages/Maintenance';
import ComingSoon from '../pages/ComingSoon';

// Information pages
import About from '../pages/About';
import OtherServices from '../pages/OtherServices';
import PrivacyPolicy from '../pages/legal/PrivacyPolicy';
import TermsConditions from '../pages/legal/TermsConditions';

// import OverviewFit from "../pages/Overveiw-fit";

function StorePreviewRoute() {
    const location = useLocation();
    // Try to get data from route state first (for backward compatibility)
    let { formData, selectedSections } = location.state || {};

    // If no route state, try to get from localStorage
    if (!formData || !selectedSections) {
        const previewData = localStorage.getItem('previewData');
        if (previewData) {
            try {
                const parsed = JSON.parse(previewData);
                formData = parsed.formData;
                selectedSections = parsed.selectedSections;
            } catch (e) {
                console.error('Failed to parse preview data:', e);
            }
        }
    }

    if (!formData || !selectedSections) return <div>No preview data available.</div>;
    return <StorePage formData={formData} selectedSections={selectedSections} previewMode={false} />;
}

function LiveStoreRoute() {
    const { id } = useParams();
    if (!id) return <div>No store ID.</div>;
    const raw = localStorage.getItem(id);
    if (!raw) return <div>Store not found in localStorage for key: {id}</div>;
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        return <div>Failed to parse store data: {String(e)}<br />Raw: {raw}</div>;
    }
    const { formData, selectedSections } = parsed || {};
    if (!formData || !selectedSections) {
        return <div>Invalid store data: {JSON.stringify(parsed)}</div>;
    }
    return <StorePage formData={formData} selectedSections={selectedSections} previewMode={false} />;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Authentication routes (no layout) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Main layout routes */}
                <Route path="/" element={<Layout />}>
                    {/* Dashboard and main pages */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="/order/:id" element={<OrderDetails />} />
                    <Route path="/order-enhanced/:id" element={<OrderDetailsEnhanced />} />

                    {/* Customer management */}
                    <Route path="customers" element={<CustomersList />} />
                    <Route path="service-team" element={<ServiceTeam />} />
                    <Route path="profile" element={<Profile />} />

                    {/* Invoice management */}
                    <Route path="create-invoice" element={<CreateInvoice />} />
                    <Route path="invoice/:id" element={<InvoiceDetails />} />

                    {/* Settings + nested routes */}
                    <Route path="settings" element={<Settings />}>
                        <Route path="website" element={<WebsiteSettings />} />
                        <Route path="general" element={<GeneralSettings />} />
                        <Route path="financial" element={<FinancialSettings />} />
                    </Route>

                    {/* Information pages */}
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<OtherServices />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="terms-conditions" element={<TermsConditions />} />

                    {/* System pages */}
                    <Route path="maintenance" element={<Maintenance />} />
                    <Route path="coming-soon" element={<ComingSoon />} />
                </Route>

                {/* Store routes (no layout) */}
                <Route path="/store-preview" element={<StorePreviewRoute />} />
                <Route path="/store/:id" element={<LiveStoreRoute />} />

                {/* Error pages (no layout) */}
                <Route path="/404" element={<NotFound />} />
                <Route path="/500" element={<ServerError />} />
                <Route path="/offline" element={<Offline />} />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
