import Common "common";

module {
  public type CompetitionStatus = { #active; #ended };

  public type Competition = {
    id : Common.CompetitionId;
    title : Text;
    description : Text;
    theme : Text;
    prizes : Text;
    startDate : Common.Timestamp;
    endDate : Common.Timestamp;
    status : CompetitionStatus;
    submissionCount : Nat;
  };

  public type CompetitionSubmission = {
    id : Common.SubmissionId;
    competitionId : Common.CompetitionId;
    userId : Common.UserId;
    startupName : Text;
    description : Text;
    pitchDeckUrl : Text;
    votes : Nat;
    voterIds : [Common.UserId]; // track who voted for one-vote-per-user enforcement
    createdAt : Common.Timestamp;
  };
};
