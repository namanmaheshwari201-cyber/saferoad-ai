import Map "mo:core/Map";
import PersonalityLib "../lib/personality";
import PersonalityTypes "../types/personality";

mixin (
  personalities : Map.Map<PersonalityTypes.PersonalityId, PersonalityTypes.AIPersonality>,
  personalityPrefs : Map.Map<Principal, PersonalityTypes.PersonalityId>,
  personalityState : { var nextPersonalityId : Nat },
) {
  /// List all available AI cofounder personalities
  public query func getPersonalities() : async [PersonalityTypes.AIPersonality] {
    PersonalityLib.listPersonalities(personalities);
  };

  /// Get the personality the caller has selected
  public query ({ caller }) func getUserPersonality() : async ?PersonalityTypes.PersonalityId {
    PersonalityLib.getUserPersonality(personalityPrefs, caller);
  };

  /// Set caller's preferred AI cofounder personality
  public shared ({ caller }) func setUserPersonality(personalityId : PersonalityTypes.PersonalityId) : async Bool {
    PersonalityLib.setUserPersonality(personalityPrefs, caller, personalityId);
    true;
  };
};
