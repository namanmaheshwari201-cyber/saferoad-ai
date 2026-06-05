import Common "common";

module {
  public type RoadRating = {
    id : Text;
    city : Text;
    roadName : Text;
    rating : Nat;
    review : Text;
    timestamp : Int;
    submitter : Text;
  };
};
