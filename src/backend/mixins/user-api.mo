import Map "mo:core/Map";
import Time "mo:core/Time";
import Common "../types/common";
import UserTypes "../types/user";
import UserLib "../lib/user";

mixin (
  profiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
  emergencyProfiles : Map.Map<Common.UserId, UserTypes.EmergencyProfile>
) {
  public shared ({ caller }) func getUserProfile() : async ?UserTypes.UserProfile {
    UserLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func upsertUserProfile(
    input : UserTypes.UserProfileInput
  ) : async Bool {
    UserLib.upsertProfile(profiles, caller, input, Time.now());
  };

  public shared ({ caller }) func getEmergencyProfile() : async ?UserTypes.EmergencyProfile {
    UserLib.getEmergencyProfile(emergencyProfiles, caller);
  };

  public shared ({ caller }) func upsertEmergencyProfile(
    input : UserTypes.EmergencyProfileInput
  ) : async Bool {
    UserLib.upsertEmergencyProfile(emergencyProfiles, caller, input, Time.now());
  };
};
