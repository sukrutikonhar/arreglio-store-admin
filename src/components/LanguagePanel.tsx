import { useRef, useEffect, useState } from "react";

const languages = [
    { label: "Sweden", code: "se", flagSrc: "/images/flags/sweden.png" },
    { label: "Finland", code: "fi", flagSrc: "/images/flags/finland.png" },
    { label: "Germany", code: "de", flagSrc: "/images/flags/germany.png" },
    { label: "USA", code: "us", flagSrc: "/images/flags/usa.png" },
    { label: "Norway", code: "no", flagSrc: "/images/flags/norway.png" },
];

interface LanguagePanelProps {
    activeIcon: "notifications" | "language" | "user" | "settings" | "menu" | null;
    setActiveIcon: (icon: "notifications" | "language" | "user" | "settings" | "menu" | null) => void;
}

export default function LanguagePanel({ activeIcon, setActiveIcon }: LanguagePanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const isOpen = activeIcon === "language";

    // Keep track of the selected language in local state.
    const [currentLang, setCurrentLang] = useState(
        languages.find((lang) => lang.code === "se") || languages[0]
    );

    useEffect(() => {
        console.log("Current selected language:", currentLang);
    }, [currentLang]);

    // Close dropdown when clicking outside.
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setActiveIcon(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setActiveIcon]);

    // Update the selected language and close the panel.
    const handleLanguageSelect = (lang: typeof languages[number]) => {
        console.log("Language selected:", lang);
        setCurrentLang(lang);
        setActiveIcon(null);
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Current Language Button */}
            <button
                onClick={() => setActiveIcon(isOpen ? null : "language")}
                className={`header-icon ${isOpen ? "active" : ""}`}
            >
                <img src={currentLang.flagSrc} alt={currentLang.label} className="w-6 h-6" />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white shadow-lg rounded-md z-50 text-black">
                    <ul className="py-2">
                        {languages.map((lang) => (
                            <li
                                key={lang.code}
                                className={`px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 ${lang.code === currentLang.code ? "bg-gray-200 font-semibold" : ""
                                    }`}
                                onMouseDown={(e) => {
                                    // Stop the event from bubbling up to the outside click handler.
                                    e.stopPropagation();
                                    handleLanguageSelect(lang);
                                }}
                            >
                                <img src={lang.flagSrc} alt={lang.label} className="w-5 h-5 mr-2" />
                                <span>{lang.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
