// Types for Feature 22 — AI Reputation & Fraud Detection
module {
  public type FlagId = Nat;
  public type FlagStatus = { #pending; #resolved };

  public type ReputationScore = {
    userId : Principal;
    overallScore : Nat;
    activityScore : Nat;
    completionRate : Nat;
    responseTime : Nat;
    fraudRisk : Text;
    lastUpdated : Int;
  };

  public type FraudFlag = {
    id : FlagId;
    reporterId : Principal;
    targetId : Principal;
    reason : Text;
    evidence : Text;
    status : FlagStatus;
    createdAt : Int;
  };
};
