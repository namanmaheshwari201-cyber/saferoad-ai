import Map "mo:core/Map";
import List "mo:core/List";
import Common "../types/common";
import SafetyTypes "../types/safety";

module {
  public func saveScore(
    scores : Map.Map<Common.UserId, SafetyTypes.DriverSafetyScore>,
    caller : Common.UserId,
    score : Nat,
    answers : Text,
    now : Common.Timestamp
  ) : Bool {
    scores.add(caller, { userId = caller; score; answers; assessedAt = now });
    true;
  };

  public func getScore(
    scores : Map.Map<Common.UserId, SafetyTypes.DriverSafetyScore>,
    caller : Common.UserId
  ) : ?SafetyTypes.DriverSafetyScore {
    scores.get(caller);
  };

  public func getRescueServices(
    services : List.List<SafetyTypes.RescueService>,
    serviceType : Text,
    city : Text
  ) : [SafetyTypes.RescueService] {
    let filtered = services.filter(func(s) {
      (serviceType == "" or s.serviceType == serviceType) and
      (city == "" or s.city == city)
    });
    filtered.toArray();
  };

  public func seedRescueServices(
    services : List.List<SafetyTypes.RescueService>,
    state : { var nextServiceId : Nat }
  ) : () {
    if (services.size() > 0) { return };
    let seed : [SafetyTypes.RescueService] = [
      { serviceId = 0; name = "AIIMS Trauma Centre"; serviceType = "hospital"; city = "Delhi"; state = "Delhi"; phone = "011-26588500"; address = "Sri Aurobindo Marg, Ansari Nagar, New Delhi"; rating = 4.8; isAvailable247 = true },
      { serviceId = 1; name = "Safdarjung Hospital"; serviceType = "hospital"; city = "Delhi"; state = "Delhi"; phone = "011-26707444"; address = "Sri Aurobindo Marg, New Delhi"; rating = 4.2; isAvailable247 = true },
      { serviceId = 2; name = "KEM Hospital"; serviceType = "hospital"; city = "Mumbai"; state = "Maharashtra"; phone = "022-24107000"; address = "Acharya Donde Marg, Parel, Mumbai"; rating = 4.5; isAvailable247 = true },
      { serviceId = 3; name = "Rajiv Gandhi Government Hospital"; serviceType = "hospital"; city = "Chennai"; state = "Tamil Nadu"; phone = "044-25305000"; address = "Park Town, Chennai"; rating = 4.1; isAvailable247 = true },
      { serviceId = 4; name = "Delhi Police PCR"; serviceType = "police"; city = "Delhi"; state = "Delhi"; phone = "100"; address = "ITO, New Delhi"; rating = 4.0; isAvailable247 = true },
      { serviceId = 5; name = "Mumbai Traffic Police"; serviceType = "police"; city = "Mumbai"; state = "Maharashtra"; phone = "103"; address = "Crawford Market, Mumbai"; rating = 3.9; isAvailable247 = true },
      { serviceId = 6; name = "Ziqitza Ambulance Delhi"; serviceType = "ambulance"; city = "Delhi"; state = "Delhi"; phone = "108"; address = "Sector 18, Noida"; rating = 4.6; isAvailable247 = true },
      { serviceId = 7; name = "GVK EMRI Ambulance"; serviceType = "ambulance"; city = "Hyderabad"; state = "Telangana"; phone = "108"; address = "Banjara Hills, Hyderabad"; rating = 4.5; isAvailable247 = true },
      { serviceId = 8; name = "Singh Roadside Assistance"; serviceType = "tow_truck"; city = "Delhi"; state = "Delhi"; phone = "9810012345"; address = "Karol Bagh, New Delhi"; rating = 4.3; isAvailable247 = false },
      { serviceId = 9; name = "Highway Angels Towing"; serviceType = "tow_truck"; city = "Mumbai"; state = "Maharashtra"; phone = "9820034567"; address = "Andheri East, Mumbai"; rating = 4.1; isAvailable247 = true }
    ];
    for (s in seed.vals()) {
      services.add(s);
    };
    state.nextServiceId := 10;
  };
};
