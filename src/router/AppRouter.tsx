import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import WebsiteSettings from "../pages/WebsiteSettings";
import GeneralSettings from "../pages/GeneralSettings";
import FinancialSettings from "../pages/FinancialSettings"; // Import new component
import StorePage from '../pages/StorePage';
import Overview from '../pages/Overview';
import OrderDetails from '../pages/OrderDetails';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import OverviewFit from "../pages/Overveiw-fit";
import StorePagePreview from '../pages/StorePagePreview';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import type { ReactElement } from 'react';
import Welcome from '../pages/Welcome';

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
    return <StorePagePreview formData={formData} selectedSections={selectedSections} />;
}

function PrivateRoute({ children }: { children: ReactElement }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        window.location.href = '/auth/login';
        return null;
    }
    return children;
}

export default function AppRouter() {
    const { isAuthenticated } = useAuth();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot" element={<ForgotPassword />} />
                <Route path="/" element={isAuthenticated ? <Layout /> : <Welcome />}>
                    {/* Protected routes inside Layout */}
                    <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="overview" element={<PrivateRoute><Overview /></PrivateRoute>} />
                    <Route path="overview-2" element={<PrivateRoute><OverviewFit /></PrivateRoute>} />
                    <Route path="order/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
                    <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>}>
                        <Route path="website" element={<WebsiteSettings />} />
                        <Route path="general" element={<GeneralSettings />} />
                        <Route path="financial" element={<FinancialSettings />} />
                    </Route>
                </Route>
                <Route path="/store-preview" element={<StorePreviewRoute />} />
                <Route path="/store/:storeId" element={<StorePage />} />
            </Routes>
        </BrowserRouter>
    );
}
