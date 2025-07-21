import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import WebsiteForm from "./WebsiteForm";

export default function WebsiteSettings() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialFormData = location.state?.formData;
    const initialSelectedSections = location.state?.selectedSections;

    const [addedOptional, setAddedOptional] = useState(() => {
        if (initialSelectedSections) {
            // Map selectedSections to addedOptional keys
            const mapping: Record<string, string> = {
                'Our Team': 'ourTeam',
                'How It Works': 'howItWorks',
                'Statistics': 'statistics',
                'Testimonials': 'testimonials',
                'Blog Section': 'blogSection',
            };
            const result: any = {};
            Object.values(mapping).forEach(key => {
                result[key] = initialSelectedSections.includes(
                    key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
                );
            });
            return result;
        }
        return {
            ourTeam: false,
            howItWorks: false,
            statistics: false,
            testimonials: false,
            blogSection: false,
        };
    });

    const [isFormVisible, setIsFormVisible] = useState(!!initialFormData);

    // Toggle optional sections
    const handleToggle = (section: keyof typeof addedOptional) => {
        setAddedOptional((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Show the form
    const handleNext = () => {
        setIsFormVisible(true);
    };

    // Cancel form and return to section view
    const handleCancel = () => {
        setIsFormVisible(false);
    };

    // Save and navigate to General Settings
    const handleSave = () => {
        navigate("/settings/general");
    };

    // Contact Info and Footer Section are now mandatory
    const mandatorySections = [
        "Header",
        "Hero",
        "What We Do",
        "Contact Info",
        "Footer Section"
    ];
    const selectedOptionalSections = Object.keys(addedOptional).filter(
        (key) => addedOptional[key as keyof typeof addedOptional]
    );

    // When showing the form, pass initialFormData and initialSelectedSections to WebsiteForm
    if (isFormVisible) {
        return <WebsiteForm
            mandatorySections={mandatorySections}
            selectedOptionalSections={Object.keys(addedOptional).filter(
                (key) => addedOptional[key as keyof typeof addedOptional]
            )}
            onCancel={handleCancel}
            onSave={handleSave}
            initialFormData={initialFormData}
            initialSelectedSections={initialSelectedSections}
        />;
    }

    return (
        <div>
            <h4 className="tab-title mb-4">Customise your website</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                {/* Mandatory Sections */}
                <div>
                    <h5 className="website-title mb-4">Mandatory sections*</h5>
                    <div className="website-tab-boxes">
                        <div>
                            <ul className="text-secondGray space-y-3">
                                {mandatorySections.map((section) => (
                                    <li key={section}>{section}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Optional Sections */}
                <div>
                    <h5 className="website-title mb-4">Optional sections</h5>
                    <div className="website-tab-boxes">
                        <div>
                            <ul className="text-secondGray space-y-3">
                                {Object.keys(addedOptional).map((key) => {
                                    // Convert camelCase to Title Case for display
                                    const displayName = key
                                        .replace(/([A-Z])/g, ' $1')
                                        .replace(/^./, str => str.toUpperCase())
                                        .replace(/\b\w/g, c => c.toUpperCase());
                                    return (
                                        <li key={key} className="flex justify-between items-center">
                                            <span>{displayName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(key as keyof typeof addedOptional)}
                                                className={addedOptional[key as keyof typeof addedOptional] ? "text-red-600" : "text-secondary"}
                                            >
                                                {addedOptional[key as keyof typeof addedOptional] ? "Remove" : "Add"}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-12 flex !space-x-3">
                <Button label="Cancel" className="btn btn-outline" onClick={handleCancel} outlined />
                <Button label="Next" className="btn btn-primary" onClick={handleNext} />
            </div>
        </div>
    );
}
