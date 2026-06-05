import Common "common";

module {
  public type ProjectStage = { #idea; #mvp; #launched };
  public type ProjectStatus = { #open; #closed };
  public type InviteStatus = { #pending; #accepted; #rejected };

  public type ProjectMember = {
    userId : Common.UserId;
    role : Text;
    joinedAt : Common.Timestamp;
  };

  public type StartupProject = {
    id : Common.ProjectId;
    creatorId : Common.UserId;
    name : Text;
    description : Text;
    vision : Text;
    stage : ProjectStage;
    category : Text;
    requiredSkills : [Text];
    teamSize : Nat;
    timeCommitment : Text;
    members : [ProjectMember];
    status : ProjectStatus;
    createdAt : Common.Timestamp;
  };

  public type TeamInvite = {
    id : Common.InviteId;
    projectId : Common.ProjectId;
    fromUserId : Common.UserId;
    toUserId : Common.UserId;
    status : InviteStatus;
    createdAt : Common.Timestamp;
  };
};
