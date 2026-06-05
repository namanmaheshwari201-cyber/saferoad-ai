// Types for Feature 21 — Startup Launch System
module {
  public type LaunchId = Nat;
  public type WaitlistId = Nat;
  public type LaunchStatus = { #upcoming; #live; #closed };

  public type StartupLaunch = {
    id : LaunchId;
    founderId : Principal;
    name : Text;
    tagline : Text;
    description : Text;
    demoUrl : Text;
    logoUrl : Text;
    tags : [Text];
    launchDate : Int;
    votes : Nat;
    followers : [Principal];
    status : LaunchStatus;
    createdAt : Int;
  };

  public type LaunchWaitlist = {
    id : WaitlistId;
    launchId : LaunchId;
    userId : Principal;
    email : Text;
    joinedAt : Int;
  };
};
