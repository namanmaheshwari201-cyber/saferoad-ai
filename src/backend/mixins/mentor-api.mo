import Map "mo:core/Map";
import MentorLib "../lib/mentor";
import MentorTypes "../types/mentor";

mixin (
  mentors : Map.Map<MentorTypes.MentorId, MentorTypes.MentorProfile>,
  mentorSessions : Map.Map<MentorTypes.SessionId, MentorTypes.MentorSession>,
  mentorState : { var nextMentorId : Nat; var nextSessionId : Nat },
) {
  /// List all mentors
  public query func getMentors() : async [MentorTypes.MentorProfile] {
    MentorLib.listMentors(mentors);
  };

  /// Get mentor profile for a given user
  public query func getMentorProfile(userId : Principal) : async ?MentorTypes.MentorProfile {
    MentorLib.getMentorByUser(mentors, userId);
  };

  /// Apply to become a mentor
  public shared ({ caller }) func applyAsMentor(
    expertise : [Text],
    bio : Text,
    hourlyRate : Nat,
    availability : Text,
  ) : async MentorTypes.MentorProfile {
    MentorLib.applyAsMentor(mentors, mentorState, caller, expertise, bio, hourlyRate, availability);
  };

  /// Book a session with a mentor
  public shared ({ caller }) func bookSession(
    mentorId : MentorTypes.MentorId,
    topic : Text,
    scheduledAt : Int,
  ) : async MentorTypes.MentorSession {
    MentorLib.bookSession(mentorSessions, mentorState, mentors, mentorId, caller, topic, scheduledAt);
  };

  /// Get all sessions for the caller (as student or mentor)
  public query ({ caller }) func getSessions() : async [MentorTypes.MentorSession] {
    MentorLib.getUserSessions(mentorSessions, caller);
  };

  /// Rate a mentor after a completed session
  public shared ({ caller }) func rateMentor(sessionId : MentorTypes.SessionId, rating : Nat) : async Bool {
    MentorLib.rateMentor(mentors, mentorSessions, sessionId, caller, rating);
  };
};
