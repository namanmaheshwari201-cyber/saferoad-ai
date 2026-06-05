import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import CompetitionLib "../lib/competition";
import CompetitionTypes "../types/competition";
import Common "../types/common";
import Principal "mo:core/Principal";

mixin (
  competitions : Map.Map<Common.CompetitionId, CompetitionTypes.Competition>,
  submissions : Map.Map<Common.SubmissionId, CompetitionTypes.CompetitionSubmission>,
  competitionState : { var nextCompetitionId : Nat; var nextSubmissionId : Nat },
) {
  /// Create a new competition
  public shared ({ caller }) func createCompetition(
    competition : CompetitionTypes.Competition
  ) : async Common.CompetitionId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to create a competition");
    CompetitionLib.createCompetition(competitions, competitionState, caller, competition);
  };

  /// Get all competitions
  public query func getCompetitions() : async [CompetitionTypes.Competition] {
    CompetitionLib.getCompetitions(competitions);
  };

  /// Submit a startup idea to a competition
  public shared ({ caller }) func submitToCompetition(
    competitionId : Common.CompetitionId,
    startupName : Text,
    description : Text,
    pitchDeckUrl : Text,
  ) : async Common.SubmissionId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to submit");
    CompetitionLib.submitToCompetition(submissions, competitions, competitionState, caller, competitionId, startupName, description, pitchDeckUrl);
  };

  /// Vote on a competition entry (one vote per user)
  public shared ({ caller }) func voteCompetitionEntry(
    submissionId : Common.SubmissionId
  ) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in to vote");
    CompetitionLib.voteOnSubmission(submissions, caller, submissionId);
  };

  /// Get competition leaderboard sorted by votes
  public query func getCompetitionLeaderboard(
    competitionId : Common.CompetitionId
  ) : async [CompetitionTypes.CompetitionSubmission] {
    CompetitionLib.getLeaderboard(submissions, competitionId);
  };
};
