import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    principal: UserId;
    city: string;
    name: string;
    createdAt: Timestamp;
    language: string;
    updatedAt: Timestamp;
    state: string;
    phone: string;
}
export interface ComplaintInput {
    locationLat: number;
    locationLng: number;
    complaintType: string;
    description: string;
    photoUrl: string;
    locationAddress: string;
}
export type Timestamp = bigint;
export interface EmergencyProfile {
    principal: UserId;
    emergencyContact1Phone: string;
    insuranceProvider: string;
    additionalNotes: string;
    medicalConditions: string;
    emergencyContact2Name: string;
    emergencyContact2Phone: string;
    updatedAt: Timestamp;
    bloodGroup: string;
    emergencyContact1Name: string;
    allergies: string;
    policyNumber: string;
}
export interface DriverSafetyScore {
    assessedAt: Timestamp;
    userId: UserId;
    answers: string;
    score: bigint;
}
export interface RoadProject {
    utilizedBudget: number;
    releasedBudget: number;
    name: string;
    lastUpdated: Timestamp;
    state: string;
    completionPercent: number;
    projectId: bigint;
    totalBudget: number;
    location: string;
    contractorName: string;
}
export interface ChatSession {
    messages: Array<ChatMessage>;
    userId: UserId;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    sessionId: bigint;
}
export interface RoadRating {
    id: string;
    review: string;
    roadName: string;
    submitter: string;
    city: string;
    timestamp: bigint;
    rating: bigint;
}
export type UserId = Principal;
export type Result = {
    __kind__: "ok";
    ok: RoadRating;
} | {
    __kind__: "err";
    err: string;
};
export interface LegalUpdate {
    title: string;
    topic: string;
    publishedAt: Timestamp;
    sourceUrl: string;
    updateId: bigint;
    summary: string;
    state: string;
}
export interface Contractor {
    status: string;
    timelineScore: number;
    overallScore: number;
    name: string;
    contractorId: bigint;
    qualityScore: number;
    state: string;
    complaintScore: number;
    projectsCompleted: bigint;
}
export interface Complaint {
    locationLat: number;
    locationLng: number;
    status: string;
    complaintId: string;
    verificationPhotoUrl: string;
    complaintType: string;
    userId: UserId;
    aiAnalysisResult: string;
    createdAt: Timestamp;
    description: string;
    photoUrl: string;
    assignedAuthority: string;
    updatedAt: Timestamp;
    locationAddress: string;
    aiSeverity: string;
    citizenVerification: string;
}
export interface ChatMessage {
    content: string;
    role: string;
    timestamp: Timestamp;
}
export interface UserProfileInput {
    city: string;
    name: string;
    language: string;
    state: string;
    phone: string;
}
export interface RescueService {
    serviceType: string;
    isAvailable247: boolean;
    city: string;
    name: string;
    state: string;
    address: string;
    rating: number;
    serviceId: bigint;
    phone: string;
}
export interface EmergencyProfileInput {
    emergencyContact1Phone: string;
    insuranceProvider: string;
    additionalNotes: string;
    medicalConditions: string;
    emergencyContact2Name: string;
    emergencyContact2Phone: string;
    bloodGroup: string;
    emergencyContact1Name: string;
    allergies: string;
    policyNumber: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMessageToSession(sessionId: bigint, role: string, content: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChatSession(): Promise<bigint>;
    deleteChatSession(sessionId: bigint): Promise<boolean>;
    getAllComplaints(): Promise<Array<Complaint>>;
    getCallerUserRole(): Promise<UserRole>;
    getChatSession(sessionId: bigint): Promise<ChatSession | null>;
    getChatSessions(): Promise<Array<ChatSession>>;
    getCityRoads(city: string): Promise<Array<string>>;
    getComplaint(complaintId: string): Promise<Complaint | null>;
    getContractors(state: string): Promise<Array<Contractor>>;
    getDriverSafetyScore(): Promise<DriverSafetyScore | null>;
    getEmergencyProfile(): Promise<EmergencyProfile | null>;
    getLegalUpdates(state: string, topic: string): Promise<Array<LegalUpdate>>;
    getRatingsForRoad(city: string, roadName: string): Promise<Array<RoadRating>>;
    getRescueServices(serviceType: string, city: string): Promise<Array<RescueService>>;
    getRoadProjects(state: string): Promise<Array<RoadProject>>;
    getUserComplaints(): Promise<Array<Complaint>>;
    getUserProfile(): Promise<UserProfile | null>;
    healthCheck(): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    saveDriverSafetyScore(score: bigint, answers: string): Promise<boolean>;
    submitComplaint(input: ComplaintInput): Promise<string>;
    submitRoadRating(city: string, roadName: string, rating: bigint, review: string): Promise<Result>;
    updateComplaintVerification(complaintId: string, verification: string, photoUrl: string): Promise<boolean>;
    upsertEmergencyProfile(input: EmergencyProfileInput): Promise<boolean>;
    upsertUserProfile(input: UserProfileInput): Promise<boolean>;
}
