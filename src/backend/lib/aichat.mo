import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/aichat";
import Common "../types/common";
import Principal "mo:core/Principal";

module {
  public func saveAIChat(
    chats : Map.Map<Common.ChatId, Types.AIChat>,
    state : { var nextChatId : Nat },
    caller : Common.UserId,
    messages : [Types.AIChatMessage],
    chatId : ?Common.ChatId,
  ) : Common.ChatId {
    switch (chatId) {
      case (?existingId) {
        switch (chats.get(existingId)) {
          case (?existing) {
            if (existing.userId != caller) Runtime.trap("Unauthorized: not your chat");
            chats.add(existingId, { existing with messages; updatedAt = Time.now() });
            existingId;
          };
          case null Runtime.trap("Chat not found");
        };
      };
      case null {
        let id = state.nextChatId;
        state.nextChatId += 1;
        let now = Time.now();
        chats.add(id, { id; userId = caller; messages; createdAt = now; updatedAt = now });
        id;
      };
    };
  };

  public func getAIChat(
    chats : Map.Map<Common.ChatId, Types.AIChat>,
    caller : Common.UserId,
    chatId : Common.ChatId,
  ) : ?Types.AIChat {
    switch (chats.get(chatId)) {
      case (?chat) { if (chat.userId != caller) null else ?chat };
      case null null;
    };
  };

  public func getUserChats(
    chats : Map.Map<Common.ChatId, Types.AIChat>,
    caller : Common.UserId,
  ) : [Types.AIChat] {
    chats.entries()
      .filter(func((_, c) : (Common.ChatId, Types.AIChat)) : Bool { c.userId == caller })
      .map(func((_, c) : (Common.ChatId, Types.AIChat)) : Types.AIChat { c })
      .toArray();
  };
};
