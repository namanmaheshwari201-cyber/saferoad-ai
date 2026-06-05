import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import ProfileTypes "../types/profile";
import Types "../types/networking";
import Array "mo:core/Array";

module {
  public func generateMatches(
    matches : Map.Map<Types.MatchId, Types.NetworkMatch>,
    state : { var nextMatchId : Nat },
    profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
    forUser : Principal,
  ) {
    let myProfile = switch (profiles.get(forUser)) {
      case null { return };
      case (?p) { p };
    };
    var count = 0;
    for ((otherId, otherProfile) in profiles.entries()) {
      if (count >= 5) return;
      if (otherId == forUser) {} else {
        let allMatches = matches.values().toArray();
        let alreadyMatched = allMatches.find(func(m : Types.NetworkMatch) : Bool {
          (m.fromUserId == forUser and m.toUserId == otherId) or (m.fromUserId == otherId and m.toUserId == forUser)
        });
        switch (alreadyMatched) {
          case (?_) {};
          case null {
            let sharedSkills = myProfile.skills.filter(func(s : Text) : Bool {
              otherProfile.skills.find<Text>(func(os : Text) : Bool { os == s }) != null
            });
            let rawScore = sharedSkills.size() * 20 + 10;
            let score = Nat.min(rawScore, 100);
            let reasons : [Text] = if (sharedSkills.size() > 0) {
              ["Shared skills: " # sharedSkills.values().join(", ")]
            } else {
              ["Complementary startup goals", "Active on platform"]
            };
            let id = state.nextMatchId;
            state.nextMatchId += 1;
            matches.add(
              id,
              {
                id;
                fromUserId = forUser;
                toUserId = otherId;
                compatibilityScore = score;
                matchReasons = reasons;
                status = #pending;
                createdAt = Time.now();
              },
            );
            count += 1;
          };
        };
      };
    };
  };

  public func getUserMatches(
    matches : Map.Map<Types.MatchId, Types.NetworkMatch>,
    userId : Principal,
  ) : [Types.NetworkMatch] {
    matches.values().toArray().filter(func(m : Types.NetworkMatch) : Bool {
      m.fromUserId == userId or m.toUserId == userId
    });
  };

  public func respondToMatch(
    matches : Map.Map<Types.MatchId, Types.NetworkMatch>,
    matchId : Types.MatchId,
    caller : Principal,
    accept : Bool,
  ) : Bool {
    switch (matches.get(matchId)) {
      case null { false };
      case (?m) {
        if (m.toUserId != caller) return false;
        let newStatus : Types.MatchStatus = if (accept) #accepted else #declined;
        matches.add(matchId, { m with status = newStatus });
        true;
      };
    };
  };

  public func getNetworkingFeed(
    matches : Map.Map<Types.MatchId, Types.NetworkMatch>,
    profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
    userId : Principal,
  ) : [Types.NetworkingFeedItem] {
    let allMatches = matches.values().toArray();
    let pendingMatches = allMatches.filter(func(m : Types.NetworkMatch) : Bool {
      m.toUserId == userId and m.status == #pending
    });
    pendingMatches.filterMap<Types.NetworkMatch, Types.NetworkingFeedItem>(func(m) {
      switch (profiles.get(m.fromUserId)) {
        case null { null };
        case (?p) {
          ?{
            matchId = m.id;
            userId = m.fromUserId;
            displayName = p.displayName;
            skills = p.skills;
            startupGoals = [p.startupGoals];
            compatibilityScore = m.compatibilityScore;
          };
        };
      };
    });
  };
};
