import { useState, useEffect } from "react";
import { NavigationItem } from "../../types/store";
import { ChevronDown, Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

export const HeaderSection = ({ storeName, navigationLinks, storeLogo, storeLogoSticky, sticky = true }: { storeName: string; navigationLinks: NavigationItem[]; storeLogo?: File | string | null; storeLogoSticky?: File | string | null; sticky?: boolean }) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);

    useEffect(() => {
        if (!sticky) return;
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };
        if (sticky) window.addEventListener('scroll', handleScroll);
        return () => { if (sticky) window.removeEventListener('scroll', handleScroll); };
    }, [sticky]);

    const background = sticky ? (isScrolled ? "#fff" : "transparent") : "#fff";
    const color = sticky ? (isScrolled ? "#333" : "#fff") : "#333";
    const boxShadow = sticky ? (isScrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none") : "none";
    const position = sticky ? "fixed" : "static";
    const transition = sticky ? "all 0.3s ease" : undefined;

    return (
        <header style={{
            background,
            color,
            padding: "1rem",
            position,
            top: sticky ? 0 : undefined,
            left: sticky ? 0 : undefined,
            right: sticky ? 0 : undefined,
            zIndex: sticky ? 1000 : undefined,
            transition,
            boxShadow
        }}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {(isScrolled && storeLogoSticky) ? (
                        <img
                            src={typeof storeLogoSticky === 'string' ? storeLogoSticky : URL.createObjectURL(storeLogoSticky)}
                            alt="Sticky Logo"
                            style={{ maxHeight: 50, maxWidth: 180, objectFit: 'contain' }}
                        />
                    ) : storeLogo ? (
                        <img
                            src={typeof storeLogo === 'string' ? storeLogo : URL.createObjectURL(storeLogo)}
                            alt="Store Logo"
                            style={{ maxHeight: 50, maxWidth: 180, objectFit: 'contain' }}
                        />
                    ) : (
                        <h1>{storeName || "Store name"}</h1>
                    )}
                </div>
                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center">
                    {(navigationLinks || []).map((item) => (
                        <div
                            key={item.id}
                            className="relative mx-2"
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <a
                                href={item.link}
                                style={{
                                    color,
                                    textDecoration: "none",
                                    padding: "0.5rem 1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                                className="hover:underline"
                            >
                                <span className="pe-1">{item.name}</span>
                                {item.hasSubmenu && item.submenu.length > 0 && (
                                    <ChevronDown size={14} />
                                )}
                            </a>
                            {/* Submenu Dropdown */}
                            {item.hasSubmenu && item.submenu.length > 0 && hoveredItem === item.id && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    background: sticky ? (isScrolled ? "#fff" : "#333") : "#fff",
                                    border: `1px solid ${sticky ? (isScrolled ? "#ddd" : "#555") : "#ddd"}`,
                                    borderRadius: "4px",
                                    minWidth: "200px",
                                    zIndex: 1000,
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                                }}>
                                    {item.submenu.map((subItem, subIdx) => (
                                        <a
                                            key={subItem.id}
                                            href={subItem.link}
                                            style={{
                                                color: sticky ? (isScrolled ? "#333" : "#fff") : "#333",
                                                textDecoration: "none",
                                                padding: "0.75rem 1rem",
                                                display: "block",
                                                borderBottom: subIdx < item.submenu.length - 1 ? `1px solid ${sticky ? (isScrolled ? "#eee" : "#555") : "#eee"}` : "none"
                                            }}
                                            onMouseEnter={(e) => e.stopPropagation()}
                                        >
                                            {subItem.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
                {/* Hamburger for mobile/tablet */}
                <button
                    className="lg:hidden flex items-center p-2 focus:outline-none"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    aria-label="Open menu"
                >
                    {mobileMenuOpen ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
                </button>
            </div>
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex flex-col lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <div className="bg-white text-gray-900 w-4/5 max-w-xs h-full p-6 shadow-lg relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                            <CloseIcon size={28} />
                        </button>
                        <div className="flex flex-col gap-4 mt-8">
                            {(navigationLinks || []).map((item) => (
                                <div key={item.id}>
                                    <div className="flex items-center justify-between cursor-pointer py-2" onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.id ? null : item.id)}>
                                        <a href={item.link} className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>{item.name}</a>
                                        {item.hasSubmenu && item.submenu.length > 0 && (
                                            <ChevronDown size={18} className={mobileSubmenuOpen === item.id ? 'rotate-180 transition-transform' : 'transition-transform'} />
                                        )}
                                    </div>
                                    {/* Mobile Submenu */}
                                    {item.hasSubmenu && item.submenu.length > 0 && mobileSubmenuOpen === item.id && (
                                        <div className="pl-4 flex flex-col gap-2 mt-1">
                                            {item.submenu.map((subItem) => (
                                                <a key={subItem.id} href={subItem.link} className="py-1 text-base text-gray-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>
                                                    {subItem.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}; 