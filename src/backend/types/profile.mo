import Common "common";

module {
  public type Badge = {
    id : Nat;
    name : Text;
    description : Text;
    icon : Text;
    earnedAt : Common.Timestamp;
  };

  public type UserProfile = {
    id : Common.UserId;
    username : Text;
    displayName : Text;
    bio : Text;
    school : Text;
    skills : [Text];
    interests : [Text];
    startupGoals : Text;
    experienceLevel : Text;
    workHours : Nat;
    preferredCategories : [Text];
    avatarUrl : Text;
    trustScore : Nat;
    badges : [Badge];
    onboardingComplete : Bool;
    createdAt : Common.Timestamp;
  };

  public type TrustScoreFactors = {
    completedOrders : Nat;
    positiveReviews : Nat;
    responseTime : Nat;
    collaborationScore : Nat;
    activityScore : Nat;
  };

  public type LeaderboardEntry = {
    userId : Common.UserId;
    username : Text;
    displayName : Text;
    avatarUrl : Text;
    trustScore : Nat;
    rank : Nat;
  };
};
