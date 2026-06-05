import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import AIChatLib "../lib/aichat";
import OpenAI "../lib/openai";
import AIChatTypes "../types/aichat";
import Common "../types/common";

mixin (
  aiChats : Map.Map<Common.ChatId, AIChatTypes.AIChat>,
  aiChatState : { var nextChatId : Nat },
  openAIKeys : Map.Map<Common.UserId, Text>,
) {
  // ---------------------------------------------------------------------------
  // OpenAI key management (per-user)
  // ---------------------------------------------------------------------------

  public query ({ caller }) func isMyOpenAIConfigured() : async Bool {
    openAIKeys.containsKey(caller);
  };

  public shared ({ caller }) func setMyOpenAIApiKey(key : Text) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in to set your API key");
    openAIKeys.add(caller, key);
  };

  public shared ({ caller }) func clearMyOpenAIApiKey() : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in to clear your API key");
    openAIKeys.remove(caller);
  };

  // ---------------------------------------------------------------------------
  // AI chat session management
  // ---------------------------------------------------------------------------

  public shared ({ caller }) func saveAIChat(
    messages : [AIChatTypes.AIChatMessage],
    chatId : ?Common.ChatId,
  ) : async Common.ChatId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to save AI chats");
    AIChatLib.saveAIChat(aiChats, aiChatState, caller, messages, chatId);
  };

  public query ({ caller }) func getAIChat(
    chatId : Common.ChatId
  ) : async ?AIChatTypes.AIChat {
    AIChatLib.getAIChat(aiChats, caller, chatId);
  };

  public query ({ caller }) func getUserChats() : async [AIChatTypes.AIChat] {
    AIChatLib.getUserChats(aiChats, caller);
  };

  // ---------------------------------------------------------------------------
  // AI message sending
  // ---------------------------------------------------------------------------

  public shared ({ caller }) func sendAIMessage(
    userMessage : Text,
    chatId : ?Common.ChatId,
  ) : async { #ok : (Text, Common.ChatId); #err : Text } {
    if (caller.isAnonymous()) return #err("Sign in to use the AI Cofounder");
    let key = switch (openAIKeys.get(caller)) {
      case (?k) k;
      case null return #err("No API key configured. Please add your OpenAI API key in Settings.");
    };

    let existingMessages : [AIChatTypes.AIChatMessage] = switch (chatId) {
      case (?id) {
        switch (AIChatLib.getAIChat(aiChats, caller, id)) {
          case (?chat) chat.messages;
          case null [];
        };
      };
      case null [];
    };

    let config = OpenAI.configForKey(key);
    let aiResponse = await* OpenAI.runChatWithHistory(config, existingMessages, userMessage);

    let now = Time.now();
    let userMsg : AIChatTypes.AIChatMessage = { role = #user; content = userMessage; createdAt = now };
    let assistantMsg : AIChatTypes.AIChatMessage = { role = #assistant; content = aiResponse; createdAt = now };
    let updatedMessages = existingMessages.concat([userMsg, assistantMsg]);

    let savedId = AIChatLib.saveAIChat(aiChats, aiChatState, caller, updatedMessages, chatId);
    #ok(aiResponse, savedId);
  };
};
