import { createActor } from "@/backend";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback } from "react";

export function useAuth() {
  return {
    isAuthenticated: true,
    displayName: "Naman Maheshwari",
    loginStatus: "success" as const,
    login: () => {},
    logout: () => {},
    isLoading: false,
    actor: null,
    checkOnboarding: async () => true,
  };
}
