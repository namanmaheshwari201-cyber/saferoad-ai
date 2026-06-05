import Common "common";

module {
  public type AIChatMessageRole = { #user; #assistant };

  public type AIChatMessage = {
    role : AIChatMessageRole;
    content : Text;
    createdAt : Common.Timestamp;
  };

  public type AIChat = {
    id : Common.ChatId;
    userId : Common.UserId;
    messages : [AIChatMessage];
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };
};
