// src/pages/Dashboard.tsx
import { useEffect } from "react";

export default function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard | Arreglio";
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p>Welcome to the Dashboard!</p>
        </div>
    );
}
