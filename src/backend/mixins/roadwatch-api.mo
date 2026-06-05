import List "mo:core/List";
import Common "../types/common";
import RoadwatchTypes "../types/roadwatch";
import RoadwatchLib "../lib/roadwatch";

mixin (
  roadProjects : List.List<RoadwatchTypes.RoadProject>,
  contractors : List.List<RoadwatchTypes.Contractor>,
  legalUpdates : List.List<RoadwatchTypes.LegalUpdate>
) {
  public shared query ({ caller }) func getRoadProjects(
    state : Text
  ) : async [RoadwatchTypes.RoadProject] {
    ignore caller;
    RoadwatchLib.getRoadProjects(roadProjects, state);
  };

  public shared query ({ caller }) func getContractors(
    state : Text
  ) : async [RoadwatchTypes.Contractor] {
    ignore caller;
    RoadwatchLib.getContractors(contractors, state);
  };

  public shared query ({ caller }) func getLegalUpdates(
    state : Text,
    topic : Text
  ) : async [RoadwatchTypes.LegalUpdate] {
    ignore caller;
    RoadwatchLib.getLegalUpdates(legalUpdates, state, topic);
  };
};
