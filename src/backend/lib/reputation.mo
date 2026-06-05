import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/reputation";

module {
  public func getReputationScore(
    scores : Map.Map<Principal, Types.ReputationScore>,
    userId : Principal,
  ) : ?Types.ReputationScore {
    scores.get(userId);
  };

  public func upsertReputationScore(
    scores : Map.Map<Principal, Types.ReputationScore>,
    userId : Principal,
  ) : Types.ReputationScore {
    let score : Types.ReputationScore = switch (scores.get(userId)) {
      case (?s) {
        let overall = (s.activityScore + s.completionRate + s.responseTime) / 3;
        let risk = if (overall >= 70) "Low" else if (overall >= 40) "Medium" else "High";
        { s with overallScore = overall; fraudRisk = risk; lastUpdated = Time.now() };
      };
      case null {
        {
          userId;
          overallScore = 50;
          activityScore = 50;
          completionRate = 0;
          responseTime = 80;
          fraudRisk = "Low";
          lastUpdated = Time.now();
        };
      };
    };
    scores.add(userId, score);
    score;
  };

  public func reportFraud(
    flags : Map.Map<Types.FlagId, Types.FraudFlag>,
    state : { var nextFlagId : Nat },
    reporter : Principal,
    targetId : Principal,
    reason : Text,
    evidence : Text,
  ) : Types.FraudFlag {
    let id = state.nextFlagId;
    state.nextFlagId += 1;
    let flag : Types.FraudFlag = {
      id;
      reporterId = reporter;
      targetId;
      reason;
      evidence;
      status = #pending;
      createdAt = Time.now();
    };
    flags.add(id, flag);
    flag;
  };

  public func listFraudFlags(
    flags : Map.Map<Types.FlagId, Types.FraudFlag>,
  ) : [Types.FraudFlag] {
    flags.values().toArray();
  };

  public func resolveFlag(
    flags : Map.Map<Types.FlagId, Types.FraudFlag>,
    flagId : Types.FlagId,
  ) : Bool {
    switch (flags.get(flagId)) {
      case null { false };
      case (?f) {
        flags.add(flagId, { f with status = #resolved });
        true;
      };
    };
  };
};
