// Types for Feature 20 — AI Networking & Introduction System
module {
  public type MatchId = Nat;
  public type MatchStatus = { #pending; #accepted; #declined };

  public type NetworkMatch = {
    id : MatchId;
    fromUserId : Principal;
    toUserId : Principal;
    compatibilityScore : Nat;
    matchReasons : [Text];
    status : MatchStatus;
    createdAt : Int;
  };

  public type NetworkingFeedItem = {
    matchId : MatchId;
    userId : Principal;
    displayName : Text;
    skills : [Text];
    startupGoals : [Text];
    compatibilityScore : Nat;
  };
};
