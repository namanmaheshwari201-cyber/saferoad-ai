import type {
  ChatMessage,
  ChatSession,
  Complaint,
  ComplaintInput,
  Contractor,
  DriverSafetyScore,
  EmergencyProfile,
  EmergencyProfileInput,
  LegalUpdate,
  RescueService,
  RoadProject,
  Timestamp,
  UserId,
  UserProfile,
  UserProfileInput,
} from "@/backend.d";

export type {
  ChatMessage,
  ChatSession,
  Complaint,
  ComplaintInput,
  Contractor,
  DriverSafetyScore,
  EmergencyProfile,
  EmergencyProfileInput,
  LegalUpdate,
  RescueService,
  RoadProject,
  Timestamp,
  UserId,
  UserProfile,
  UserProfileInput,
};

export type NavPage =
  | "home"
  | "drivelegal"
  | "roadwatch"
  | "roadsos"
  | "safety"
  | "profile"
  | "blackspot"
  | "digitaltwin"
  | "nightsafety"
  | "crowdsourcing"
  | "road-safety-challenge"
  | "schoolzone"
  | "riskpredictor"
  | "saferoute"
  | "hazardnetwork"
  | "aipotholescanner"
  | "cityleaderboard"
  | "aipotholescanner";

export interface NavItem {
  id: NavPage;
  label: string;
  requiresAuth: boolean;
}
