// src/App.tsx
import AppRouter from "./router/AppRouter";
import { TeamProvider } from "./context/TeamContext";
import { ServiceProvider } from "./context/ServiceContext";

export default function App() {
  return (
    <TeamProvider>
      <ServiceProvider>
        <AppRouter />
      </ServiceProvider>
    </TeamProvider>
  );
}
