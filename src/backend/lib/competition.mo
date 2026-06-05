import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/competition";
import Common "../types/common";
import Principal "mo:core/Principal";

module {
  public func createCompetition(
    competitions : Map.Map<Common.CompetitionId, Types.Competition>,
    state : { var nextCompetitionId : Nat },
    _caller : Common.UserId,
    competition : Types.Competition,
  ) : Common.CompetitionId {
    let id = state.nextCompetitionId;
    state.nextCompetitionId += 1;
    let normalized : Types.Competition = { competition with id; submissionCount = 0 };
    competitions.add(id, normalized);
    id;
  };

  public func getCompetitions(
    competitions : Map.Map<Common.CompetitionId, Types.Competition>,
  ) : [Types.Competition] {
    competitions.entries()
      .map(func((_, c) : (Common.CompetitionId, Types.Competition)) : Types.Competition { c })
      .toArray();
  };

  public func submitToCompetition(
    submissions : Map.Map<Common.SubmissionId, Types.CompetitionSubmission>,
    competitions : Map.Map<Common.CompetitionId, Types.Competition>,
    state : { var nextSubmissionId : Nat },
    caller : Common.UserId,
    competitionId : Common.CompetitionId,
    startupName : Text,
    description : Text,
    pitchDeckUrl : Text,
  ) : Common.SubmissionId {
    let id = state.nextSubmissionId;
    state.nextSubmissionId += 1;
    let sub : Types.CompetitionSubmission = {
      id;
      competitionId;
      userId = caller;
      startupName;
      description;
      pitchDeckUrl;
      votes = 0;
      voterIds = [];
      createdAt = Time.now();
    };
    submissions.add(id, sub);
    switch (competitions.get(competitionId)) {
      case (?comp) {
        competitions.add(competitionId, { comp with submissionCount = comp.submissionCount + 1 });
      };
      case null {};
    };
    id;
  };

  public func voteOnSubmission(
    submissions : Map.Map<Common.SubmissionId, Types.CompetitionSubmission>,
    caller : Common.UserId,
    submissionId : Common.SubmissionId,
  ) : () {
    switch (submissions.get(submissionId)) {
      case (?sub) {
        let alreadyVoted = sub.voterIds.find(func(id : Common.UserId) : Bool { id == caller }) != null;
        if (alreadyVoted) return;
        let updated : Types.CompetitionSubmission = {
          sub with
          votes = sub.votes + 1;
          voterIds = sub.voterIds.concat([caller]);
        };
        submissions.add(submissionId, updated);
      };
      case null {};
    };
  };

  public func getLeaderboard(
    submissions : Map.Map<Common.SubmissionId, Types.CompetitionSubmission>,
    competitionId : Common.CompetitionId,
  ) : [Types.CompetitionSubmission] {
    let subs = submissions.entries()
      .filter(func((_, s) : (Common.SubmissionId, Types.CompetitionSubmission)) : Bool {
        s.competitionId == competitionId;
      })
      .map(func((_, s) : (Common.SubmissionId, Types.CompetitionSubmission)) : Types.CompetitionSubmission { s })
      .toArray();
    subs.sort(func(a : Types.CompetitionSubmission, b : Types.CompetitionSubmission) : { #less; #equal; #greater } {
      if (a.votes > b.votes) #less
      else if (a.votes < b.votes) #greater
      else #equal;
    });
  };

  public func seedCompetitions(
    competitions : Map.Map<Common.CompetitionId, Types.Competition>,
    state : { var nextCompetitionId : Nat },
  ) : () {
    if (state.nextCompetitionId > 0) return;
    let now = Time.now();
    let oneMonth : Int = 30 * 24 * 3600 * 1_000_000_000;
    competitions.add(0, {
      id = 0;
      title = "Startup Sprint \u{2014} Summer 2025";
      description = "Build a startup MVP in 30 days. Best pitch wins! Open to all students aged 13-22. Present your idea, show a working prototype, and compete for recognition and mentorship.";
      theme = "EdTech & Social Impact";
      prizes = "\u{1F947} $500 + Mentorship | \u{1F948} $250 | \u{1F949} $100 + Swag";
      startDate = now;
      endDate = now + oneMonth;
      status = #active;
      submissionCount = 0;
    });
    competitions.add(1, {
      id = 1;
      title = "AI for Good Challenge";
      description = "Use AI to solve a real-world problem faced by students or local communities. Projects will be judged on creativity, technical depth, and social impact potential.";
      theme = "Artificial Intelligence";
      prizes = "\u{1F947} $1000 + VC Meeting | \u{1F948} $500 | \u{1F949} $200";
      startDate = now;
      endDate = now + oneMonth * 2;
      status = #active;
      submissionCount = 0;
    });
    competitions.add(2, {
      id = 2;
      title = "Teen Founders Hackathon";
      description = "48-hour hackathon for teen founders. Build fast, pitch hard. Any domain welcome.";
      theme = "Open Innovation";
      prizes = "\u{1F947} Featured on Foundrly + $300 | \u{1F948} $150 | \u{1F949} $75";
      startDate = now;
      endDate = now + oneMonth / 2;
      status = #active;
      submissionCount = 0;
    });
    state.nextCompetitionId := 3;
  };
};
