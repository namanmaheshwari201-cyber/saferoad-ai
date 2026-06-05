// Types for Feature 19 — Startup Equity & Role Management
module {
  public type EquityId = Nat;
  public type AgreementId = Nat;

  public type EquityRecord = {
    id : EquityId;
    projectId : Nat;
    userId : Principal;
    role : Text;
    equityPercent : Nat;
    contributionScore : Nat;
    joinedAt : Int;
  };

  public type FounderAgreement = {
    id : AgreementId;
    projectId : Nat;
    terms : Text;
    createdAt : Int;
    signedBy : [Principal];
  };
};
