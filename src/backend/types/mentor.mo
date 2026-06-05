// Types for Feature 23 — Investor / Mentor Connect System
module {
  public type MentorId = Nat;
  public type SessionId = Nat;
  public type SessionStatus = { #requested; #confirmed; #completed; #cancelled };

  public type MentorProfile = {
    id : MentorId;
    userId : Principal;
    expertise : [Text];
    bio : Text;
    hourlyRate : Nat;
    availability : Text;
    isVerified : Bool;
    rating : Nat;
    sessionCount : Nat;
    createdAt : Int;
  };

  public type MentorSession = {
    id : SessionId;
    mentorId : MentorId;
    mentorUserId : Principal;
    studentId : Principal;
    topic : Text;
    scheduledAt : Int;
    status : SessionStatus;
    notes : Text;
    createdAt : Int;
  };
};
