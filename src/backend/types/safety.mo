import Common "common";

module {
  public type DriverSafetyScore = {
    userId : Common.UserId;
    score : Nat;
    answers : Text;
    assessedAt : Common.Timestamp;
  };

  public type RescueService = {
    serviceId : Nat;
    name : Text;
    serviceType : Text;
    city : Text;
    state : Text;
    phone : Text;
    address : Text;
    rating : Float;
    isAvailable247 : Bool;
  };
};
