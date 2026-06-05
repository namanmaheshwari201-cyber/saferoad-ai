import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/mentor";
import Principal "mo:core/Principal";

module {
  public func seedMentors(
    mentors : Map.Map<Types.MentorId, Types.MentorProfile>,
    state : { var nextMentorId : Nat },
  ) {
    let samples : [(Text, [Text], Text, Nat, Text)] = [
      (
        "aaaa-aa",
        ["Product Strategy", "Fundraising", "SaaS"],
        "Former VP at a Series-B SaaS startup. Helped 30+ founders go from idea to first $1M ARR. Specializes in B2B product strategy and early-stage fundraising.",
        50,
        "Weekends, 9am-1pm IST",
      ),
      (
        "bbbb-bb",
        ["AI/ML", "Tech Architecture", "Deep Tech"],
        "Ex-Google engineer with 12 years in machine learning. Built and scaled AI products used by millions. Loves helping technical founders navigate the product-market fit phase.",
        75,
        "Tuesdays & Thursdays, 6pm-9pm IST",
      ),
      (
        "cccc-cc",
        ["Marketing", "Growth Hacking", "D2C Brands"],
        "Grew three D2C brands from zero to $5M revenue combined. Expert in performance marketing, brand positioning, and community-led growth.",
        40,
        "Mon/Wed/Fri, 5pm-7pm IST",
      ),
      (
        "dddd-dd",
        ["Angel Investing", "Startup Ecosystems", "EdTech"],
        "Angel investor with a portfolio of 15 early-stage startups. Former founder of an EdTech company (exited). Passionate about education and youth entrepreneurship.",
        60,
        "Saturdays, 10am-2pm IST",
      ),
    ];
    for ((_, expertise, bio, hourlyRate, availability) in samples.values()) {
      let id = state.nextMentorId;
      state.nextMentorId += 1;
      mentors.add(
        id,
        {
          id;
          userId = Principal.anonymous();
          expertise;
          bio;
          hourlyRate;
          availability;
          isVerified = true;
          rating = 90;
          sessionCount = 0;
          createdAt = Time.now();
        },
      );
    };
  };

  public func listMentors(
    mentors : Map.Map<Types.MentorId, Types.MentorProfile>,
  ) : [Types.MentorProfile] {
    mentors.values().toArray();
  };

  public func getMentorByUser(
    mentors : Map.Map<Types.MentorId, Types.MentorProfile>,
    userId : Principal,
  ) : ?Types.MentorProfile {
    mentors.values().find(func(m : Types.MentorProfile) : Bool { m.userId == userId });
  };

  public func applyAsMentor(
    mentors : Map.Map<Types.MentorId, Types.MentorProfile>,
    state : { var nextMentorId : Nat },
    caller : Principal,
    expertise : [Text],
    bio : Text,
    hourlyRate : Nat,
    availability : Text,
  ) : Types.MentorProfile {
    let id = state.nextMentorId;
    state.nextMentorId += 1;
    let mentor : Types.MentorProfile = {
      id;
      userId = caller;
      expertise;
      bio;
      hourlyRate;
      availability;
      isVerified = false;
      rating = 0;
      sessionCount = 0;
      createdAt = Time.now();
    };
    mentors.add(id, mentor);
    mentor;
  };

  public func bookSession(
    sessions : Map.Map<Types.SessionId, Types.MentorSession>,
    state : { var nextSessionId : Nat },
    mentors : Map.Map<Types.MentorId, Types.MentorProfile>,
    mentorId : Types.MentorId,
    student : Principal,
    topic : Text,
    scheduledAt : Int,
  ) : Types.MentorSession {
    let mentor = switch (mentors.get(mentorId)) {
      case null { Runtime.trap("Mentor not found") };
      case (?m) { m };
    };
    let id = state.nextSessionId;
    state.nextSessionId += 1;
    let session : Types.MentorSession = {
      id;
      mentorId;
      mentorUserId = mentor.userId;
      studentId = student;
      topic;
      scheduledAt;
      status = #requested;
      notes = "";
      createdAt = Time.now();
    };
    sessions.add(id, session);
    session;
  };

  public func getUserSessions(
    sessions : Map.Map<Types.SessionId, Types.MentorSession>,
    userId : Principal,
  ) : [Types.MentorSession] {
    sessions.values().filter(func(s : Types.MentorSession) : Bool {
      s.studentId == userId or s.mentorUserId == userId
    }).toArray();
  };

  public func rateMentor(
    mentors : Map.Map<Types.MentorId, Types.MentorProfile>,
    sessions : Map.Map<Types.SessionId, Types.MentorSession>,
    sessionId : Types.SessionId,
    caller : Principal,
    rating : Nat,
  ) : Bool {
    switch (sessions.get(sessionId)) {
      case null { false };
      case (?s) {
        if (s.studentId != caller) return false;
        switch (mentors.get(s.mentorId)) {
          case null { false };
          case (?m) {
            let totalRating = m.rating * m.sessionCount + rating;
            let newCount = m.sessionCount + 1;
            let newRating = totalRating / newCount;
            mentors.add(m.id, { m with rating = newRating; sessionCount = newCount });
            sessions.add(sessionId, { s with status = #completed });
            true;
          };
        };
      };
    };
  };
};
