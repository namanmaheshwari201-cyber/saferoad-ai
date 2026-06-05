import Map "mo:core/Map";
import Common "../types/common";
import ChatTypes "../types/chat";
import List "mo:core/List";
import Array "mo:core/Array";

module {
  public func getSessions(
    sessions : Map.Map<Nat, ChatTypes.ChatSessionInternal>,
    caller : Common.UserId
  ) : [ChatTypes.ChatSession] {
    let buf = List.empty<ChatTypes.ChatSession>();
    for ((_, s) in sessions.entries()) {
      if (s.userId == caller) {
        buf.add({ sessionId = s.sessionId; userId = s.userId; messages = s.messages; createdAt = s.createdAt; updatedAt = s.updatedAt });
      };
    };
    buf.toArray();
  };

  public func getSession(
    sessions : Map.Map<Nat, ChatTypes.ChatSessionInternal>,
    caller : Common.UserId,
    sessionId : Nat
  ) : ?ChatTypes.ChatSession {
    switch (sessions.get(sessionId)) {
      case (?s) {
        if (s.userId == caller) {
          ?{ sessionId = s.sessionId; userId = s.userId; messages = s.messages; createdAt = s.createdAt; updatedAt = s.updatedAt };
        } else { null };
      };
      case null { null };
    };
  };

  public func createSession(
    sessions : Map.Map<Nat, ChatTypes.ChatSessionInternal>,
    state : { var nextSessionId : Nat },
    caller : Common.UserId,
    now : Common.Timestamp
  ) : Nat {
    let id = state.nextSessionId;
    state.nextSessionId += 1;
    let session : ChatTypes.ChatSessionInternal = {
      sessionId = id;
      userId = caller;
      var messages = [];
      createdAt = now;
      var updatedAt = now;
    };
    sessions.add(id, session);
    id;
  };

  public func addMessage(
    sessions : Map.Map<Nat, ChatTypes.ChatSessionInternal>,
    caller : Common.UserId,
    sessionId : Nat,
    role : Text,
    content : Text,
    now : Common.Timestamp
  ) : Bool {
    switch (sessions.get(sessionId)) {
      case (?s) {
        if (s.userId != caller) { return false };
        let msg : ChatTypes.ChatMessage = { role; content; timestamp = now };
        s.messages := s.messages.concat([msg]);
        s.updatedAt := now;
        true;
      };
      case null { false };
    };
  };

  public func deleteSession(
    sessions : Map.Map<Nat, ChatTypes.ChatSessionInternal>,
    caller : Common.UserId,
    sessionId : Nat
  ) : Bool {
    switch (sessions.get(sessionId)) {
      case (?s) {
        if (s.userId != caller) { return false };
        sessions.remove(sessionId);
        true;
      };
      case null { false };
    };
  };
};
