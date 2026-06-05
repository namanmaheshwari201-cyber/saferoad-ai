import Map "mo:core/Map";
import NetworkingLib "../lib/networking";
import NetworkingTypes "../types/networking";
import ProfileTypes "../types/profile";

mixin (
  networkMatches : Map.Map<NetworkingTypes.MatchId, NetworkingTypes.NetworkMatch>,
  matchState : { var nextMatchId : Nat },
  profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
) {
  /// Get all network matches for the caller (as sender or receiver)
  public query ({ caller }) func getNetworkMatches() : async [NetworkingTypes.NetworkMatch] {
    NetworkingLib.getUserMatches(networkMatches, caller);
  };

  /// Accept or decline a network match
  public shared ({ caller }) func respondToMatch(matchId : NetworkingTypes.MatchId, accept : Bool) : async Bool {
    NetworkingLib.respondToMatch(networkMatches, matchId, caller, accept);
  };

  /// Get the networking feed (pending suggestions sent to the caller)
  public query ({ caller }) func getNetworkingFeed() : async [NetworkingTypes.NetworkingFeedItem] {
    NetworkingLib.getNetworkingFeed(networkMatches, profiles, caller);
  };

  /// Trigger AI match generation for the caller
  public shared ({ caller }) func generateNetworkMatches() : async Nat {
    let before = NetworkingLib.getUserMatches(networkMatches, caller).size();
    NetworkingLib.generateMatches(networkMatches, matchState, profiles, caller);
    let after = NetworkingLib.getUserMatches(networkMatches, caller).size();
    after - before;
  };
};
