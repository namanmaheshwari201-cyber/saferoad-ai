import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { ArrowRight, Rocket, TrendingUp, Trophy, Users } from "lucide-react";

type NavPage =
  | "home"
  | "dashboard"
  | "ai-cofounder"
  | "marketplace"
  | "team-builder"
  | "competitions"
  | "messages"
  | "profile"
  | "settings"
  | "onboarding";

interface HomePageProps {
  onNavigate: (page: NavPage) => void;
}

export default function FoundrlyHome({ onNavigate }: HomePageProps) {
  const { isAuthenticated, login } = useInternetIdentity();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Foundrly</h1>
      <p className="text-muted-foreground mb-6">
        Build your startup with AI-powered tools.
      </p>
      {!isAuthenticated && (
        <Button onClick={login} data-ocid="home.primary_button">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      {isAuthenticated && (
        <Button
          onClick={() => onNavigate("dashboard")}
          data-ocid="home.primary_button"
        >
          Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
