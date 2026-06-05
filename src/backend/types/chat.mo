import Common "common";

module {
  public type ChatMessage = {
    role : Text;
    content : Text;
    timestamp : Common.Timestamp;
  };

  public type ChatSession = {
    sessionId : Nat;
    userId : Common.UserId;
    messages : [ChatMessage];
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  // Internal session with mutable messages list
  public type ChatSessionInternal = {
    sessionId : Nat;
    userId : Common.UserId;
    var messages : [ChatMessage];
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };
};
