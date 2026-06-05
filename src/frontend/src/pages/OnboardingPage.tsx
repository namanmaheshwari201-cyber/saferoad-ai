interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold" style={{ color: "#1a3c5e" }}>
        Welcome to RoadGuardian AI
      </h1>
      <p className="mt-2 text-muted-foreground">Setting up your profile.</p>
      <button
        type="button"
        onClick={onComplete}
        className="mt-4 px-4 py-2 rounded-md text-white text-sm font-medium"
        style={{ background: "#1a3c5e" }}
      >
        Get Started
      </button>
    </div>
  );
}
