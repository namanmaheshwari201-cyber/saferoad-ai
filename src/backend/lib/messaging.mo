import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Types "../types/messaging";
import Common "../types/common";

module {
  func findConversation(
    conversations : Map.Map<Common.ConversationId, Types.Conversation>,
    user1 : Common.UserId,
    user2 : Common.UserId,
  ) : ?Common.ConversationId {
    var found : ?Common.ConversationId = null;
    for ((id, conv) in conversations.entries()) {
      if (not conv.isGroup and conv.participants.size() == 2) {
        let hasUser1 = conv.participants.find(func(p : Common.UserId) : Bool { Principal.equal(p, user1) }) != null;
        let hasUser2 = conv.participants.find(func(p : Common.UserId) : Bool { Principal.equal(p, user2) }) != null;
        if (hasUser1 and hasUser2) { found := ?id };
      };
    };
    found;
  };

  public func sendMessage(
    messages : Map.Map<Common.MessageId, Types.Message>,
    conversations : Map.Map<Common.ConversationId, Types.Conversation>,
    state : { var nextMessageId : Nat; var nextConversationId : Nat },
    caller : Common.UserId,
    conversationId : Common.ConversationId,
    content : Text,
    messageType : Types.MessageType,
    fileUrl : ?Text,
  ) : Common.MessageId {
    switch (conversations.get(conversationId)) {
      case (?conv) {
        let isMember = conv.participants.find(func(p : Common.UserId) : Bool { Principal.equal(p, caller) }) != null;
        if (not isMember) Runtime.trap("Not a participant in this conversation");
      };
      case null Runtime.trap("Conversation not found");
    };
    let id = state.nextMessageId;
    state.nextMessageId += 1;
    let now = Time.now();
    let msg : Types.Message = {
      id; conversationId; senderId = caller;
      content; messageType; fileUrl; createdAt = now;
    };
    messages.add(id, msg);
    switch (conversations.get(conversationId)) {
      case (?conv) {
        conversations.add(conversationId, { conv with lastMessage = content; lastMessageAt = now });
      };
      case null {};
    };
    id;
  };

  public func getMessages(
    messages : Map.Map<Common.MessageId, Types.Message>,
    conversations : Map.Map<Common.ConversationId, Types.Conversation>,
    caller : Common.UserId,
    conversationId : Common.ConversationId,
  ) : [Types.Message] {
    switch (conversations.get(conversationId)) {
      case (?conv) {
        let isMember = conv.participants.find(func(p : Common.UserId) : Bool { Principal.equal(p, caller) }) != null;
        if (not isMember) Runtime.trap("Not a participant in this conversation");
      };
      case null Runtime.trap("Conversation not found");
    };
    messages.entries().filter(func((_, m) : (Common.MessageId, Types.Message)) : Bool {
      m.conversationId == conversationId;
    }).map(func((_, m) : (Common.MessageId, Types.Message)) : Types.Message { m })
      .toArray();
  };

  public func getConversations(
    conversations : Map.Map<Common.ConversationId, Types.Conversation>,
    caller : Common.UserId,
  ) : [Types.Conversation] {
    conversations.entries().filter(func((_, c) : (Common.ConversationId, Types.Conversation)) : Bool {
      c.participants.find(func(p : Common.UserId) : Bool { Principal.equal(p, caller) }) != null;
    }).map(func((_, c) : (Common.ConversationId, Types.Conversation)) : Types.Conversation { c })
      .toArray();
  };

  public func getOrCreateConversation(
    conversations : Map.Map<Common.ConversationId, Types.Conversation>,
    state : { var nextMessageId : Nat; var nextConversationId : Nat },
    caller : Common.UserId,
    otherUserId : Common.UserId,
  ) : Common.ConversationId {
    switch (findConversation(conversations, caller, otherUserId)) {
      case (?existingId) existingId;
      case null {
        let id = state.nextConversationId;
        state.nextConversationId += 1;
        conversations.add(id, {
          id;
          participants = [caller, otherUserId];
          lastMessage = "";
          lastMessageAt = Time.now();
          isGroup = false;
          name = "";
        });
        id;
      };
    };
  };
};
