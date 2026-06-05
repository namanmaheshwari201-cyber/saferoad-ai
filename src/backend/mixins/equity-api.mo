import Map "mo:core/Map";
import EquityLib "../lib/equity";
import EquityTypes "../types/equity";

mixin (
  equityRecords : Map.Map<EquityTypes.EquityId, EquityTypes.EquityRecord>,
  agreements : Map.Map<EquityTypes.AgreementId, EquityTypes.FounderAgreement>,
  equityState : { var nextEquityId : Nat; var nextAgreementId : Nat },
) {
  /// Get all equity records for a project
  public query func getEquityRecords(projectId : Nat) : async [EquityTypes.EquityRecord] {
    EquityLib.getProjectEquity(equityRecords, projectId);
  };

  /// Create or update an equity record for a project member
  public shared ({ caller }) func setEquityRecord(
    projectId : Nat,
    userId : Principal,
    role : Text,
    equityPercent : Nat,
  ) : async EquityTypes.EquityRecord {
    EquityLib.setEquityRecord(equityRecords, equityState, projectId, userId, role, equityPercent);
  };

  /// Get founder agreement for a project
  public query func getFounderAgreement(projectId : Nat) : async ?EquityTypes.FounderAgreement {
    EquityLib.getFounderAgreement(agreements, projectId);
  };

  /// Create a new founder agreement for a project
  public shared ({ caller }) func createFounderAgreement(
    projectId : Nat,
    terms : Text,
  ) : async EquityTypes.FounderAgreement {
    EquityLib.createFounderAgreement(agreements, equityState, projectId, terms, caller);
  };

  /// Sign an existing founder agreement
  public shared ({ caller }) func signFounderAgreement(agreementId : EquityTypes.AgreementId) : async Bool {
    EquityLib.signAgreement(agreements, agreementId, caller);
  };
};
