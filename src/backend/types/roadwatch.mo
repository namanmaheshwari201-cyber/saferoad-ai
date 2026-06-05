import Common "common";

module {
  public type RoadProject = {
    projectId : Nat;
    name : Text;
    location : Text;
    state : Text;
    totalBudget : Float;
    releasedBudget : Float;
    utilizedBudget : Float;
    contractorName : Text;
    completionPercent : Float;
    lastUpdated : Common.Timestamp;
  };

  public type Contractor = {
    contractorId : Nat;
    name : Text;
    state : Text;
    qualityScore : Float;
    timelineScore : Float;
    complaintScore : Float;
    overallScore : Float;
    projectsCompleted : Nat;
    status : Text;
  };

  public type LegalUpdate = {
    updateId : Nat;
    title : Text;
    summary : Text;
    state : Text;
    topic : Text;
    publishedAt : Common.Timestamp;
    sourceUrl : Text;
  };
};
