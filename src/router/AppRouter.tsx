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
                <Route path="/" element={<Layout />}>
                    {/* Main pages */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="overview-2" element={<OverviewFit />} />
                    <Route path="/order/:id" element={<OrderDetails />} />

                    {/* Settings + nested routes */}
                    <Route path="settings" element={<Settings />}>
                        <Route path="website" element={<WebsiteSettings />} />
                        <Route path="general" element={<GeneralSettings />} />
                        <Route path="financial" element={<FinancialSettings />} /> {/* New Route */}
                    </Route>
                </Route>
                <Route path="/store-preview" element={<StorePreviewRoute />} />
                <Route path="/store/:id" element={<LiveStoreRoute />} />
            </Routes>
        </BrowserRouter>
    );
}
