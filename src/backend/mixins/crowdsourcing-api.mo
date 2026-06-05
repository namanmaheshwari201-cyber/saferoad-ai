import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

import Types "../types/crowdsourcing";
import CrowdsourcingLib "../lib/crowdsourcing";
import CoreTypes "mo:core/Types";

mixin (
  ratings : Map.Map<Text, Types.RoadRating>,
  ratingSeq : { var next : Nat }
) {

  public query func getCityRoads(city : Text) : async [Text] {
    CrowdsourcingLib.getCityRoads(city);
  };

  public query func getRatingsForRoad(city : Text, roadName : Text) : async [Types.RoadRating] {
    CrowdsourcingLib.getRatingsForRoad(ratings, city, roadName);
  };

  public shared ({ caller }) func submitRoadRating(
    city : Text,
    roadName : Text,
    rating : Nat,
    review : Text
  ) : async CoreTypes.Result<Types.RoadRating, Text> {
    let submitter = caller.toText();
    CrowdsourcingLib.submitRoadRating(ratings, ratingSeq, city, roadName, rating, review, submitter);
  };
};
