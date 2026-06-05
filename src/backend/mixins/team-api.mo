import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import TeamLib "../lib/team";
import TeamTypes "../types/team";
import Common "../types/common";
import Principal "mo:core/Principal";

mixin (
  projects : Map.Map<Common.ProjectId, TeamTypes.StartupProject>,
  invites : Map.Map<Common.InviteId, TeamTypes.TeamInvite>,
  teamState : { var nextProjectId : Nat; var nextInviteId : Nat },
) {
  /// Create a new startup project
  public shared ({ caller }) func createStartupProject(
    project : TeamTypes.StartupProject
  ) : async Common.ProjectId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to create a project");
    TeamLib.createProject(projects, teamState, caller, project);
  };

  /// Get all open startup projects, optionally filtered
  public query func getStartupProjects(
    filter : ?Text
  ) : async [TeamTypes.StartupProject] {
    TeamLib.getProjects(projects, filter);
  };

  /// Send a team invite to another user
  public shared ({ caller }) func sendTeamInvite(
    projectId : Common.ProjectId,
    toUserId : Common.UserId,
  ) : async Common.InviteId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to send invites");
    TeamLib.sendTeamInvite(invites, teamState, caller, projectId, toUserId);
  };

  /// Accept or reject a team invite
  public shared ({ caller }) func respondToInvite(
    inviteId : Common.InviteId,
    accept : Bool,
  ) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in to respond to invites");
    TeamLib.respondToInvite(invites, projects, caller, inviteId, accept);
  };

  /// Get all pending invites for the caller
  public query ({ caller }) func getTeamInvites() : async [TeamTypes.TeamInvite] {
    TeamLib.getTeamInvites(invites, caller);
  };

  /// Search projects by keyword
  public query func searchProjects(
    searchTerm : Text
  ) : async [TeamTypes.StartupProject] {
    TeamLib.searchProjects(projects, searchTerm);
  };
};
