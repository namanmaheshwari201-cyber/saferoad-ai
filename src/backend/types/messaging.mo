import Common "common";

module {
  public type MessageType = { #text; #image; #file };

  public type Message = {
    id : Common.MessageId;
    conversationId : Common.ConversationId;
    senderId : Common.UserId;
    content : Text;
    messageType : MessageType;
    fileUrl : ?Text;
    createdAt : Common.Timestamp;
  };

  public type Conversation = {
    id : Common.ConversationId;
    participants : [Common.UserId];
    lastMessage : Text;
    lastMessageAt : Common.Timestamp;
    isGroup : Bool;
    name : Text;
  };
};
