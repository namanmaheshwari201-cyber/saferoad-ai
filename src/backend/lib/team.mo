import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/team";
import Common "../types/common";

module {
  public func createProject(
    projects : Map.Map<Common.ProjectId, Types.StartupProject>,
    state : { var nextProjectId : Nat },
    caller : Common.UserId,
    project : Types.StartupProject,
  ) : Common.ProjectId {
    let id = state.nextProjectId;
    state.nextProjectId += 1;
    let creatorMember : Types.ProjectMember = {
      userId = caller; role = "Founder"; joinedAt = Time.now();
    };
    projects.add(id, {
      project with id; creatorId = caller;
      members = [creatorMember]; status = #open; createdAt = Time.now();
    });
    id;
  };

  public func getProjects(
    projects : Map.Map<Common.ProjectId, Types.StartupProject>,
    filter : ?Text,
  ) : [Types.StartupProject] {
    let all = projects.entries().map(
      func((_, p) : (Common.ProjectId, Types.StartupProject)) : Types.StartupProject { p }
    );
    switch (filter) {
      case (null) all.toArray();
      case (?f) {
        let fLower = f.toLower();
        all.filter(func(p : Types.StartupProject) : Bool {
          p.category.toLower() == fLower or
          (switch (p.stage) {
            case (#idea) "idea" == fLower;
            case (#mvp) "mvp" == fLower;
            case (#launched) "launched" == fLower;
          })
        }).toArray();
      };
    };
  };

  public func sendTeamInvite(
    invites : Map.Map<Common.InviteId, Types.TeamInvite>,
    state : { var nextInviteId : Nat },
    caller : Common.UserId,
    projectId : Common.ProjectId,
    toUserId : Common.UserId,
  ) : Common.InviteId {
    let id = state.nextInviteId;
    state.nextInviteId += 1;
    invites.add(id, {
      id; projectId; fromUserId = caller;
      toUserId; status = #pending; createdAt = Time.now();
    });
    id;
  };

  public func respondToInvite(
    invites : Map.Map<Common.InviteId, Types.TeamInvite>,
    projects : Map.Map<Common.ProjectId, Types.StartupProject>,
    caller : Common.UserId,
    inviteId : Common.InviteId,
    accept : Bool,
  ) : () {
    switch (invites.get(inviteId)) {
      case (?invite) {
        if (not Principal.equal(invite.toUserId, caller)) return;
        let newStatus : Types.InviteStatus = if (accept) #accepted else #rejected;
        invites.add(inviteId, { invite with status = newStatus });
        if (accept) {
          switch (projects.get(invite.projectId)) {
            case (?project) {
              let newMember : Types.ProjectMember = {
                userId = caller; role = "Member"; joinedAt = Time.now();
              };
              projects.add(invite.projectId, {
                project with members = project.members.concat([newMember]);
              });
            };
            case null {};
          };
        };
      };
      case null {};
    };
  };

  public func getTeamInvites(
    invites : Map.Map<Common.InviteId, Types.TeamInvite>,
    caller : Common.UserId,
  ) : [Types.TeamInvite] {
    invites.entries().filter(func((_, i) : (Common.InviteId, Types.TeamInvite)) : Bool {
      Principal.equal(i.toUserId, caller) and i.status == #pending;
    }).map(func((_, i) : (Common.InviteId, Types.TeamInvite)) : Types.TeamInvite { i })
      .toArray();
  };

  public func searchProjects(
    projects : Map.Map<Common.ProjectId, Types.StartupProject>,
    searchTerm : Text,
  ) : [Types.StartupProject] {
    let term = searchTerm.toLower();
    projects.entries().filter(func((_, p) : (Common.ProjectId, Types.StartupProject)) : Bool {
      p.name.toLower().contains(#text term) or
      p.description.toLower().contains(#text term) or
      p.category.toLower().contains(#text term) or
      p.requiredSkills.find(func(s : Text) : Bool { s.toLower().contains(#text term) }) != null;
    }).map(func((_, p) : (Common.ProjectId, Types.StartupProject)) : Types.StartupProject { p })
      .toArray();
  };
};
