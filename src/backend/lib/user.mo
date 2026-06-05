import Map "mo:core/Map";
import Time "mo:core/Time";
import Common "../types/common";
import UserTypes "../types/user";

module {
  public func getProfile(
    profiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
    caller : Common.UserId
  ) : ?UserTypes.UserProfile {
    profiles.get(caller);
  };

  public func upsertProfile(
    profiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
    caller : Common.UserId,
    input : UserTypes.UserProfileInput,
    now : Common.Timestamp
  ) : Bool {
    let existing = profiles.get(caller);
    let profile : UserTypes.UserProfile = switch existing {
      case (?p) { { p with name = input.name; phone = input.phone; state = input.state; city = input.city; language = input.language; updatedAt = now } };
      case null { { principal = caller; name = input.name; phone = input.phone; state = input.state; city = input.city; language = input.language; createdAt = now; updatedAt = now } };
    };
    profiles.add(caller, profile);
    true;
  };

  public func getEmergencyProfile(
    emergencyProfiles : Map.Map<Common.UserId, UserTypes.EmergencyProfile>,
    caller : Common.UserId
  ) : ?UserTypes.EmergencyProfile {
    emergencyProfiles.get(caller);
  };

  public func upsertEmergencyProfile(
    emergencyProfiles : Map.Map<Common.UserId, UserTypes.EmergencyProfile>,
    caller : Common.UserId,
    input : UserTypes.EmergencyProfileInput,
    now : Common.Timestamp
  ) : Bool {
    let profile : UserTypes.EmergencyProfile = {
      principal = caller;
      bloodGroup = input.bloodGroup;
      allergies = input.allergies;
      medicalConditions = input.medicalConditions;
      emergencyContact1Name = input.emergencyContact1Name;
      emergencyContact1Phone = input.emergencyContact1Phone;
      emergencyContact2Name = input.emergencyContact2Name;
      emergencyContact2Phone = input.emergencyContact2Phone;
      insuranceProvider = input.insuranceProvider;
      policyNumber = input.policyNumber;
      additionalNotes = input.additionalNotes;
      updatedAt = now;
    };
    emergencyProfiles.add(caller, profile);
    true;
  };
};
