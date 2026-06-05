import { createActor } from "@/backend";
import type {
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
  UserProfile,
  UserProfileInput,
} from "@/backend.d";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useActor_() {
  return useActor(createActor);
}

// === User Profile ===
export function useUserProfile() {
  const { actor, isFetching } = useActor_();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpsertUserProfile() {
  const { actor } = useActor_();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UserProfileInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.upsertUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// === Emergency Profile ===
export function useEmergencyProfile() {
  const { actor, isFetching } = useActor_();
  return useQuery<EmergencyProfile | null>({
    queryKey: ["emergencyProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getEmergencyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpsertEmergencyProfile() {
  const { actor } = useActor_();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EmergencyProfileInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.upsertEmergencyProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencyProfile"] });
    },
  });
}

// === Chat Sessions ===
export function useChatSessions() {
  const { actor, isFetching } = useActor_();
  return useQuery<ChatSession[]>({
    queryKey: ["chatSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateChatSession() {
  const { actor } = useActor_();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createChatSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
    },
  });
}

export function useAddMessage() {
  const { actor } = useActor_();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      role,
      content,
    }: {
      sessionId: bigint;
      role: string;
      content: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMessageToSession(sessionId, role, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
    },
  });
}

// === Complaints ===
export function useComplaints() {
  const { actor, isFetching } = useActor_();
  return useQuery<Complaint[]>({
    queryKey: ["userComplaints"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserComplaints();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllComplaints() {
  const { actor, isFetching } = useActor_();
  return useQuery<Complaint[]>({
    queryKey: ["allComplaints"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllComplaints();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitComplaint() {
  const { actor } = useActor_();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ComplaintInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitComplaint(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userComplaints"] });
      queryClient.invalidateQueries({ queryKey: ["allComplaints"] });
    },
  });
}

export function useUpdateComplaintVerification() {
  const { actor } = useActor_();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      complaintId,
      verification,
      photoUrl,
    }: {
      complaintId: string;
      verification: string;
      photoUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateComplaintVerification(
        complaintId,
        verification,
        photoUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userComplaints"] });
      queryClient.invalidateQueries({ queryKey: ["allComplaints"] });
    },
  });
}

// === Road Projects ===
export function useRoadProjects(state = "") {
  const { actor, isFetching } = useActor_();
  return useQuery<RoadProject[]>({
    queryKey: ["roadProjects", state],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRoadProjects(state);
    },
    enabled: !!actor && !isFetching,
  });
}

// === Contractors ===
export function useContractors(state = "") {
  const { actor, isFetching } = useActor_();
  return useQuery<Contractor[]>({
    queryKey: ["contractors", state],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContractors(state);
    },
    enabled: !!actor && !isFetching,
  });
}

// === Legal Updates ===
export function useLegalUpdates(state = "", topic = "") {
  const { actor, isFetching } = useActor_();
  return useQuery<LegalUpdate[]>({
    queryKey: ["legalUpdates", state, topic],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLegalUpdates(state, topic);
    },
    enabled: !!actor && !isFetching,
  });
}

// === Rescue Services ===
export function useRescueServices(serviceType = "", city = "") {
  const { actor, isFetching } = useActor_();
  return useQuery<RescueService[]>({
    queryKey: ["rescueServices", serviceType, city],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRescueServices(serviceType, city);
    },
    enabled: !!actor && !isFetching,
  });
}

// === Driver Safety Score ===
export function useDriverSafetyScore() {
  const { actor, isFetching } = useActor_();
  return useQuery<DriverSafetyScore | null>({
    queryKey: ["driverSafetyScore"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDriverSafetyScore();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveDriverSafetyScore() {
  const { actor } = useActor_();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      score,
      answers,
    }: { score: bigint; answers: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveDriverSafetyScore(score, answers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverSafetyScore"] });
    },
  });
}
