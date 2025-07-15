// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="main-content-wrapper">
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
