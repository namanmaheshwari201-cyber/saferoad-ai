import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Types "../types/equity";

module {
  public func getProjectEquity(
    equityRecords : Map.Map<Types.EquityId, Types.EquityRecord>,
    projectId : Nat,
  ) : [Types.EquityRecord] {
    equityRecords.values().toArray().filter(func(r : Types.EquityRecord) : Bool { r.projectId == projectId });
  };

  public func setEquityRecord(
    equityRecords : Map.Map<Types.EquityId, Types.EquityRecord>,
    state : { var nextEquityId : Nat },
    projectId : Nat,
    userId : Principal,
    role : Text,
    equityPercent : Nat,
  ) : Types.EquityRecord {
    let existing = equityRecords.values().toArray().find(func(r : Types.EquityRecord) : Bool {
      r.projectId == projectId and r.userId == userId
    });
    switch (existing) {
      case (?r) {
        let updated = { r with role; equityPercent };
        equityRecords.add(r.id, updated);
        updated;
      };
      case null {
        let id = state.nextEquityId;
        state.nextEquityId += 1;
        let record : Types.EquityRecord = {
          id;
          projectId;
          userId;
          role;
          equityPercent;
          contributionScore = 0;
          joinedAt = Time.now();
        };
        equityRecords.add(id, record);
        record;
      };
    };
  };

  public func getFounderAgreement(
    agreements : Map.Map<Nat, Types.FounderAgreement>,
    projectId : Nat,
  ) : ?Types.FounderAgreement {
    agreements.values().toArray().find(func(a : Types.FounderAgreement) : Bool { a.projectId == projectId });
  };

  public func createFounderAgreement(
    agreements : Map.Map<Nat, Types.FounderAgreement>,
    state : { var nextAgreementId : Nat },
    projectId : Nat,
    terms : Text,
    caller : Principal,
  ) : Types.FounderAgreement {
    let id = state.nextAgreementId;
    state.nextAgreementId += 1;
    let agreement : Types.FounderAgreement = {
      id;
      projectId;
      terms;
      createdAt = Time.now();
      signedBy = [caller];
    };
    agreements.add(id, agreement);
    agreement;
  };

  public func signAgreement(
    agreements : Map.Map<Nat, Types.FounderAgreement>,
    agreementId : Nat,
    signer : Principal,
  ) : Bool {
    switch (agreements.get(agreementId)) {
      case null { false };
      case (?a) {
        if (a.signedBy.find(func(p : Principal) : Bool { p == signer }) != null) {
          return false;
        };
        let updated = { a with signedBy = a.signedBy.concat([signer]) };
        agreements.add(agreementId, updated);
        true;
      };
    };
  };
};
