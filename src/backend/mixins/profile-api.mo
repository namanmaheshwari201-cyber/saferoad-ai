import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";
import Common "../types/common";
import Principal "mo:core/Principal";

mixin (
  profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
) {
  /// Save or update the caller's profile
  public shared ({ caller }) func saveProfile(
    profile : ProfileTypes.UserProfile
  ) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in to save your profile");
    ProfileLib.saveProfile(profiles, caller, profile);
  };

  /// Get any user's profile by ID
  public query func getProfile(
    userId : Common.UserId
  ) : async ?ProfileTypes.UserProfile {
    ProfileLib.getProfile(profiles, userId);
  };

  /// Get the caller's own profile
  public query ({ caller }) func getCallerProfile() : async ?ProfileTypes.UserProfile {
    ProfileLib.getProfile(profiles, caller);
  };

  // Authorization extension requires these names:
  public query ({ caller }) func getCallerUserProfile() : async ?ProfileTypes.UserProfile {
    ProfileLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(
    profile : ProfileTypes.UserProfile
  ) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in to save your profile");
    ProfileLib.saveProfile(profiles, caller, profile);
  };

  public query func getUserProfile(
    userId : Common.UserId
  ) : async ?ProfileTypes.UserProfile {
    ProfileLib.getProfile(profiles, userId);
  };

  /// Get trust score factors for a user
  public query func getUserTrustScore(
    userId : Common.UserId
  ) : async ProfileTypes.TrustScoreFactors {
    ProfileLib.computeTrustScore(profiles, userId);
  };

  /// Get global leaderboard sorted by trust score
  public query func getLeaderboard() : async [ProfileTypes.LeaderboardEntry] {
    ProfileLib.getLeaderboard(profiles);
  };

  /// Search users by username or skill
  public query func searchUsers(
    searchTerm : Text
  ) : async [ProfileTypes.UserProfile] {
    ProfileLib.searchUsers(profiles, searchTerm);
  };
};
