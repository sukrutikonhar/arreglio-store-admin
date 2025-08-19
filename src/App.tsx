// src/App.tsx
import AppRouter from "./router/AppRouter";
import { TeamProvider } from "./context/TeamContext";

export default function App() {
  return (
    <TeamProvider>
      <AppRouter />
    </TeamProvider>
  );
}
