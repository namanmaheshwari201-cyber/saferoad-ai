import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../types/profile";
import Common "../types/common";

module {
  public func saveProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    caller : Common.UserId,
    profile : Types.UserProfile,
  ) : () {
    let normalized : Types.UserProfile = { profile with id = caller };
    profiles.add(caller, normalized);
  };

  public func getProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
  ) : ?Types.UserProfile {
    profiles.get(userId);
  };

  public func computeTrustScore(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
  ) : Types.TrustScoreFactors {
    switch (profiles.get(userId)) {
      case (?p) {
        let nowNs : Int = Time.now();
        let ageSeconds : Int = (nowNs - p.createdAt) / 1_000_000_000;
        let activityScore : Nat = if (ageSeconds > 0) {
          let days = ageSeconds / 86400;
          let score = days / 7;
          let bounded = if (score > 10) 10 else score;
          bounded.toNat();
        } else { 0 };
        {
          completedOrders = 0;
          positiveReviews = 0;
          responseTime = 5;
          collaborationScore = 0;
          activityScore;
        };
      };
      case null {
        { completedOrders = 0; positiveReviews = 0; responseTime = 0; collaborationScore = 0; activityScore = 0 };
      };
    };
  };

  public func updateTrustScore(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
    completedOrders : Nat,
    positiveReviews : Nat,
    activityScore : Nat,
    collaborationScore : Nat,
  ) : () {
    switch (profiles.get(userId)) {
      case (?p) {
        let newScore = (completedOrders * 10) + (positiveReviews * 5) + (activityScore * 2) + (collaborationScore * 3);
        profiles.add(userId, { p with trustScore = newScore });
      };
      case null {};
    };
  };

  public func getLeaderboard(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
  ) : [Types.LeaderboardEntry] {
    let allProfiles = profiles.entries().map(
      func((_, p) : (Common.UserId, Types.UserProfile)) : Types.UserProfile { p }
    ).toArray();
    let sorted = allProfiles.sort(func(a : Types.UserProfile, b : Types.UserProfile) : { #less; #equal; #greater } {
      if (a.trustScore > b.trustScore) #less
      else if (a.trustScore < b.trustScore) #greater
      else #equal;
    });
    sorted.mapEntries(func(p : Types.UserProfile, idx : Nat) : Types.LeaderboardEntry {
      {
        userId = p.id;
        username = p.username;
        displayName = p.displayName;
        avatarUrl = p.avatarUrl;
        trustScore = p.trustScore;
        rank = idx + 1;
      };
    });
  };

  public func searchUsers(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    searchTerm : Text,
  ) : [Types.UserProfile] {
    let term = searchTerm.toLower();
    profiles.entries().filter(func((_, p) : (Common.UserId, Types.UserProfile)) : Bool {
      p.username.toLower().contains(#text term) or
      p.displayName.toLower().contains(#text term) or
      p.skills.find(func(s : Text) : Bool { s.toLower().contains(#text term) }) != null;
    }).map(func((_, p) : (Common.UserId, Types.UserProfile)) : Types.UserProfile { p })
      .toArray();
  };
};
