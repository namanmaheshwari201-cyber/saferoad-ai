import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Int "mo:core/Int";

import Types "../types/crowdsourcing";
import CoreTypes "mo:core/Types";

module {

  // ---------------------------------------------------------------------------
  // getCityRoads — hardcoded real road names for major Indian cities
  // ---------------------------------------------------------------------------
  public func getCityRoads(city : Text) : [Text] {
    switch (city) {
      case "Delhi" {
        ["NH-44 (GT Road)", "Ring Road", "Outer Ring Road", "NH-48 (Delhi-Gurugram)",
         "Mehrauli-Badarpur Road", "Mathura Road", "NH-9 (Delhi-Meerut)"]
      };
      case "Mumbai" {
        ["Western Express Highway", "Eastern Express Highway", "SV Road", "LBS Marg",
         "NH-8 (Mumbai-Pune)", "Sion-Panvel Highway", "Andheri-Kurla Road"]
      };
      case "Bangalore" {
        ["Outer Ring Road", "NH-44 (Hosur Road)", "Bellary Road", "Old Madras Road",
         "Mysore Road", "Tumkur Road", "NICE Road"]
      };
      case "Chennai" {
        ["Anna Salai", "GST Road", "ECR (East Coast Road)",
         "OMR (Old Mahabalipuram Road)", "Poonamallee High Road", "NH-16"]
      };
      case "Kolkata" {
        ["AJC Bose Road", "VIP Road", "EM Bypass", "NH-12 (Jessore Road)",
         "Diamond Harbour Road", "Circular Canal Road"]
      };
      case "Hyderabad" {
        ["Outer Ring Road", "NH-44 (NH-7)", "Necklace Road", "Jubilee Hills Road",
         "Hitech City Road", "LB Nagar-Shamshabad Road"]
      };
      case "Pune" {
        ["NH-48 (Pune-Mumbai)", "Pune-Solapur Road", "Katraj-Dehu Road Bypass",
         "Sinhagad Road", "Nagar Road", "Baner Road"]
      };
      case "Ahmedabad" {
        ["SG Highway", "NH-48 (Ahmedabad-Vadodara)", "CG Road",
         "Sardar Patel Ring Road", "Satellite Road", "SP Ring Road"]
      };
      case _ { [] };
    };
  };

  // ---------------------------------------------------------------------------
  // getRatingsForRoad — filter ratings by city + roadName
  // ---------------------------------------------------------------------------
  public func getRatingsForRoad(
    ratings : Map.Map<Text, Types.RoadRating>,
    city : Text,
    roadName : Text
  ) : [Types.RoadRating] {
    let matched = List.empty<Types.RoadRating>();
    for ((_, r) in ratings.entries()) {
      if (r.city == city and r.roadName == roadName) {
        matched.add(r);
      };
    };
    matched.toArray();
  };

  // ---------------------------------------------------------------------------
  // submitRoadRating — validates and stores a new rating
  // ---------------------------------------------------------------------------
  public func submitRoadRating(
    ratings : Map.Map<Text, Types.RoadRating>,
    ratingSeq : { var next : Nat },
    city : Text,
    roadName : Text,
    rating : Nat,
    review : Text,
    submitter : Text
  ) : CoreTypes.Result<Types.RoadRating, Text> {
    if (rating < 1 or rating > 5) {
      return #err("Rating must be between 1 and 5");
    };
    if (city.size() == 0) {
      return #err("City must not be empty");
    };
    if (roadName.size() == 0) {
      return #err("Road name must not be empty");
    };
    let id = "rr-" # ratingSeq.next.toText();
    ratingSeq.next += 1;
    let record : Types.RoadRating = {
      id;
      city;
      roadName;
      rating;
      review;
      timestamp = Time.now();
      submitter;
    };
    ratings.add(id, record);
    #ok(record);
  };
};
