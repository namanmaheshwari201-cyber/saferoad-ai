import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import AIPotholeScanner from "./pages/AIPotholeScanner";
import { BlackspotPage } from "./pages/BlackspotPage";
import CityLeaderboardPage from "./pages/CityLeaderboardPage";
import { CrowdsourcingPage } from "./pages/CrowdsourcingPage";
import DigitalTwinPage from "./pages/DigitalTwinPage";
import { DriveLegalPage } from "./pages/DriveLegalPage";
import { HazardNetworkPage } from "./pages/HazardNetworkPage";
import { HomePage } from "./pages/HomePage";
import { NightSafetyPage } from "./pages/NightSafetyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RiskPredictorPage } from "./pages/RiskPredictorPage";
import { RoadSOSPage } from "./pages/RoadSOSPage";
import { RoadSafetyChallengePage } from "./pages/RoadSafetyChallengePage";
import { RoadWatchPage } from "./pages/RoadWatchPage";
import SafeRoutePage from "./pages/SafeRoutePage";
import SafetyAnalyticsPage from "./pages/SafetyAnalyticsPage";
import { SchoolZonePage } from "./pages/SchoolZonePage";
import type { NavPage } from "./types";

const queryClient = new QueryClient();

function AppContent() {
  const [currentPage, setCurrentPage] = useState<NavPage>("home");

  const navigate = (page: NavPage) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <ErrorBoundary>
      <Layout currentPage={currentPage} onNavigate={navigate}>
        {currentPage === "home" && <HomePage onNavigate={navigate} />}
        {currentPage === "drivelegal" && <DriveLegalPage />}
        {currentPage === "roadwatch" && <RoadWatchPage />}
        {currentPage === "roadsos" && <RoadSOSPage />}
        {currentPage === "safety" && <SafetyAnalyticsPage />}
        {currentPage === "profile" && <ProfilePage />}
        {currentPage === "blackspot" && <BlackspotPage />}
        {currentPage === "digitaltwin" && (
          <DigitalTwinPage onNavigate={navigate} />
        )}
        {currentPage === "nightsafety" && <NightSafetyPage />}
        {currentPage === "crowdsourcing" && <CrowdsourcingPage />}
        {currentPage === "road-safety-challenge" && (
          <RoadSafetyChallengePage onNavigate={navigate} />
        )}
        {currentPage === "schoolzone" && <SchoolZonePage />}
        {currentPage === "riskpredictor" && <RiskPredictorPage />}
        {currentPage === "saferoute" && <SafeRoutePage onNavigate={navigate} />}
        {currentPage === "hazardnetwork" && <HazardNetworkPage />}
        {currentPage === "cityleaderboard" && <CityLeaderboardPage />}
        {currentPage === "aipotholescanner" && <AIPotholeScanner />}
      </Layout>
      <Toaster richColors position="top-right" />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
