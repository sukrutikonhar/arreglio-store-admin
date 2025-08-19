// src/components/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
    const location = useLocation();
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="main-content-wrapper">
                <main className="flex-1">
                    <Outlet key={location.pathname} />
                </main>
            </div>
        </div>
    );
}
