import Map "mo:core/Map";
import List "mo:core/List";
import Common "../types/common";
import SafetyTypes "../types/safety";
import SafetyLib "../lib/safety";
import Time "mo:core/Time";

mixin (
  driverScores : Map.Map<Common.UserId, SafetyTypes.DriverSafetyScore>,
  rescueServices : List.List<SafetyTypes.RescueService>
) {
  public shared ({ caller }) func saveDriverSafetyScore(
    score : Nat,
    answers : Text
  ) : async Bool {
    SafetyLib.saveScore(driverScores, caller, score, answers, Time.now());
  };

  public shared ({ caller }) func getDriverSafetyScore() : async ?SafetyTypes.DriverSafetyScore {
    SafetyLib.getScore(driverScores, caller);
  };

  public shared query ({ caller }) func getRescueServices(
    serviceType : Text,
    city : Text
  ) : async [SafetyTypes.RescueService] {
    ignore caller;
    SafetyLib.getRescueServices(rescueServices, serviceType, city);
  };
};
