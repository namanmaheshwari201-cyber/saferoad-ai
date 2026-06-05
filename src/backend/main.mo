import Map "mo:core/Map";
import List "mo:core/List";

import Common "types/common";
import UserTypes "types/user";
import ChatTypes "types/chat";
import ComplaintTypes "types/complaint";
import SafetyTypes "types/safety";
import RoadwatchTypes "types/roadwatch";

import MixinUser "mixins/user-api";
import MixinChat "mixins/chat-api";
import MixinComplaint "mixins/complaint-api";
import MixinSafety "mixins/safety-api";
import MixinRoadwatch "mixins/roadwatch-api";

import RoadwatchLib "lib/roadwatch";
import SafetyLib "lib/safety";

import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import CrowdsourcingTypes "types/crowdsourcing";
import _CrowdsourcingLib "lib/crowdsourcing";
import MixinCrowdsourcing "mixins/crowdsourcing-api";


actor {
  // ---------------------------------------------------------------------------
  // Authorization state
  // ---------------------------------------------------------------------------
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  // ---------------------------------------------------------------------------
  // User & Emergency Profile state
  // ---------------------------------------------------------------------------
  let profiles = Map.empty<Common.UserId, UserTypes.UserProfile>();
  let emergencyProfiles = Map.empty<Common.UserId, UserTypes.EmergencyProfile>();
  include MixinUser(profiles, emergencyProfiles);

  // ---------------------------------------------------------------------------
  // Chat Sessions state
  // ---------------------------------------------------------------------------
  let chatSessions = Map.empty<Nat, ChatTypes.ChatSessionInternal>();
  let chatState = { var nextSessionId = 0 };
  include MixinChat(chatSessions, chatState);

  // ---------------------------------------------------------------------------
  // Complaints state
  // ---------------------------------------------------------------------------
  let complaints = Map.empty<Text, ComplaintTypes.Complaint>();
  let complaintState = { var nextComplaintSeq = 0 };
  include MixinComplaint(complaints, complaintState);

  // ---------------------------------------------------------------------------
  // Safety state — driver scores + rescue services (seeded)
  // ---------------------------------------------------------------------------
  let driverScores = Map.empty<Common.UserId, SafetyTypes.DriverSafetyScore>();
  let rescueServices = List.empty<SafetyTypes.RescueService>();
  let rescueState = { var nextServiceId = 0 };
  SafetyLib.seedRescueServices(rescueServices, rescueState);
  include MixinSafety(driverScores, rescueServices);

  // ---------------------------------------------------------------------------
  // RoadWatch state — projects, contractors, legal updates (seeded)
  // ---------------------------------------------------------------------------
  let roadProjects = List.empty<RoadwatchTypes.RoadProject>();
  let roadContractors = List.empty<RoadwatchTypes.Contractor>();
  let legalUpdates = List.empty<RoadwatchTypes.LegalUpdate>();
  let roadwatchState = { var nextProjectId = 0; var nextContractorId = 0; var nextUpdateId = 0 };
  RoadwatchLib.seedRoadData(roadProjects, roadContractors, legalUpdates, roadwatchState);
  include MixinRoadwatch(roadProjects, roadContractors, legalUpdates);

  // ---------------------------------------------------------------------------
  // Road Quality Crowdsourcing state
  // ---------------------------------------------------------------------------
  let roadRatings = Map.empty<Text, CrowdsourcingTypes.RoadRating>();
  let ratingSeq = { var next = 0 };
  include MixinCrowdsourcing(roadRatings, ratingSeq);

  // ---------------------------------------------------------------------------
  // Utility
  // ---------------------------------------------------------------------------
  public query func healthCheck() : async Text {
    "RoadGuardian AI backend is healthy";
  };
};
