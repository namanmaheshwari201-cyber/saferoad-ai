import Map "mo:core/Map";
import Common "../types/common";
import ChatTypes "../types/chat";
import ChatLib "../lib/chat";
import Time "mo:core/Time";

mixin (
  chatSessions : Map.Map<Nat, ChatTypes.ChatSessionInternal>,
  chatState : { var nextSessionId : Nat }
) {
  public shared ({ caller }) func getChatSessions() : async [ChatTypes.ChatSession] {
    ChatLib.getSessions(chatSessions, caller);
  };

  public shared ({ caller }) func getChatSession(
    sessionId : Nat
  ) : async ?ChatTypes.ChatSession {
    ChatLib.getSession(chatSessions, caller, sessionId);
  };

  public shared ({ caller }) func createChatSession() : async Nat {
    ChatLib.createSession(chatSessions, chatState, caller, Time.now());
  };

  public shared ({ caller }) func addMessageToSession(
    sessionId : Nat,
    role : Text,
    content : Text
  ) : async Bool {
    ChatLib.addMessage(chatSessions, caller, sessionId, role, content, Time.now());
  };

  public shared ({ caller }) func deleteChatSession(
    sessionId : Nat
  ) : async Bool {
    ChatLib.deleteSession(chatSessions, caller, sessionId);
  };
};
