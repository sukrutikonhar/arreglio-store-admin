import { useNavigate, useLocation } from "react-router-dom";
import WebsiteSettings from "./WebsiteSettings";
import GeneralSettings from "./GeneralSettings";
import FinancialSettings from "./FinancialSettings"; // Import new component

export default function Settings() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine the active tab
    const currentTab = location.pathname.includes("general")
        ? "general"
        : location.pathname.includes("financial")
            ? "financial"
            : "website";

    return (
        <div className="p-8 main-content-wrapper">
            <h4 className="page-title">Settings</h4>
            {/* Breadcrumb */}
            <div className="text-sm b-2 breadcrumbs mb-6">
                Home - <span className="">Settings</span>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => navigate("/settings/website")}
                    className={`tab-button ${currentTab === "website" ? "active" : "inactive"}`}
                >
                    Website
                </button>
                <button
                    onClick={() => navigate("/settings/general")}
                    className={`tab-button ${currentTab === "general" ? "active" : "inactive"}`}
                >
                    General
                </button>
                <button
                    onClick={() => navigate("/settings/financial")}
                    className={`tab-button ${currentTab === "financial" ? "active" : "inactive"}`}
                >
                    Financial
                </button>
            </div>

            {/* Page Content */}
            <div className="content">
                {currentTab === "website" ? <WebsiteSettings /> :
                    currentTab === "general" ? <GeneralSettings /> :
                        <FinancialSettings />}
            </div>
        </div>
    );
}
