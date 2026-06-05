import Map "mo:core/Map";
import ReputationLib "../lib/reputation";
import ReputationTypes "../types/reputation";

mixin (
  reputationScores : Map.Map<Principal, ReputationTypes.ReputationScore>,
  fraudFlags : Map.Map<ReputationTypes.FlagId, ReputationTypes.FraudFlag>,
  reputationState : { var nextFlagId : Nat },
) {
  /// Get the reputation score for a user
  public query func getReputationScore(userId : Principal) : async ?ReputationTypes.ReputationScore {
    ReputationLib.getReputationScore(reputationScores, userId);
  };

  /// Report a user for fraudulent or inappropriate behavior
  public shared ({ caller }) func reportFraud(
    targetId : Principal,
    reason : Text,
    evidence : Text,
  ) : async ReputationTypes.FraudFlag {
    ReputationLib.reportFraud(fraudFlags, reputationState, caller, targetId, reason, evidence);
  };

  /// Admin: list all fraud flags
  public query func getFraudFlags() : async [ReputationTypes.FraudFlag] {
    ReputationLib.listFraudFlags(fraudFlags);
  };

  /// Admin: resolve a fraud flag
  public shared ({ caller }) func resolveFlag(flagId : ReputationTypes.FlagId) : async Bool {
    ReputationLib.resolveFlag(fraudFlags, flagId);
  };
};
