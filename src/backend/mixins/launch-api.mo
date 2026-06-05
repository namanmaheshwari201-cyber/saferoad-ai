import Map "mo:core/Map";
import LaunchLib "../lib/launch";
import LaunchTypes "../types/launch";

mixin (
  launches : Map.Map<LaunchTypes.LaunchId, LaunchTypes.StartupLaunch>,
  waitlist : Map.Map<LaunchTypes.WaitlistId, LaunchTypes.LaunchWaitlist>,
  launchState : { var nextLaunchId : Nat; var nextWaitlistId : Nat },
) {
  /// List all startup launches
  public query func getLaunches() : async [LaunchTypes.StartupLaunch] {
    LaunchLib.listLaunches(launches);
  };

  /// Get top voted / trending launches
  public query func getTrendingLaunches() : async [LaunchTypes.StartupLaunch] {
    LaunchLib.getTrendingLaunches(launches);
  };

  /// Get a single launch by id
  public query func getLaunch(launchId : LaunchTypes.LaunchId) : async ?LaunchTypes.StartupLaunch {
    LaunchLib.getLaunch(launches, launchId);
  };

  /// Create a new startup launch listing
  public shared ({ caller }) func createLaunch(
    name : Text,
    tagline : Text,
    description : Text,
    demoUrl : Text,
    logoUrl : Text,
    tags : [Text],
    launchDate : Int,
  ) : async LaunchTypes.StartupLaunch {
    LaunchLib.createLaunch(launches, launchState, caller, name, tagline, description, demoUrl, logoUrl, tags, launchDate);
  };

  /// Upvote a launch
  public shared ({ caller }) func voteLaunch(launchId : LaunchTypes.LaunchId) : async Bool {
    LaunchLib.voteLaunch(launches, launchId, caller);
  };

  /// Follow a launch to receive updates
  public shared ({ caller }) func followLaunch(launchId : LaunchTypes.LaunchId) : async Bool {
    LaunchLib.followLaunch(launches, caller, launchId);
  };

  /// Join the waitlist for a launch
  public shared ({ caller }) func joinWaitlist(launchId : LaunchTypes.LaunchId, email : Text) : async LaunchTypes.LaunchWaitlist {
    LaunchLib.joinWaitlist(waitlist, launchState, launchId, caller, email);
  };
};
