import { useNavigate, useLocation } from "react-router-dom";
import WebsiteSettings from "./WebsiteSettings";
import GeneralSettings from "./GeneralSettings";
import FinancialSettings from "./FinancialSettings"; // Import new component
import { TabView, TabPanel } from 'primereact/tabview';

export default function Settings() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine the active tab index
    const tabIndex = location.pathname.includes("general")
        ? 1
        : location.pathname.includes("financial")
            ? 2
            : 0;

    // Handle tab change to update the route
    const handleTabChange = (e: { index: number }) => {
        if (e.index === 0) navigate("/settings/website");
        else if (e.index === 1) navigate("/settings/general");
        else if (e.index === 2) navigate("/settings/financial");
    };

    return (
        <div className="p-2 sm:p-4 md:p-8 main-content-wrapper">
            <h4 className="page-title">Settings</h4>
            {/* Breadcrumb */}
            <div className="text-sm b-2 breadcrumbs mb-6">
                Home - <span className="">Settings</span>
            </div>

            {/* PrimeReact TabView Navigation */}
            <div className="mb-8 settings-tab">
                <TabView activeIndex={tabIndex} onTabChange={handleTabChange} className="w-full">
                    <TabPanel header="Website">
                        <div className="content">
                            <WebsiteSettings />
                        </div>
                    </TabPanel>
                    <TabPanel header="General">
                        <div className="content">
                            <GeneralSettings />
                        </div>
                    </TabPanel>
                    <TabPanel header="Financial">
                        <div className="content">
                            <FinancialSettings />
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
}
