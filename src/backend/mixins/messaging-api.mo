import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import MessagingLib "../lib/messaging";
import MessagingTypes "../types/messaging";
import Common "../types/common";
import Principal "mo:core/Principal";

mixin (
  messages : Map.Map<Common.MessageId, MessagingTypes.Message>,
  conversations : Map.Map<Common.ConversationId, MessagingTypes.Conversation>,
  messagingState : { var nextMessageId : Nat; var nextConversationId : Nat },
) {
  /// Get or create a 1-1 DM conversation with another user
  public shared ({ caller }) func getOrCreateConversation(
    otherUserId : Common.UserId
  ) : async Common.ConversationId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to use messaging");
    MessagingLib.getOrCreateConversation(conversations, messagingState, caller, otherUserId);
  };

  /// Send a message in a conversation
  public shared ({ caller }) func sendMessage(
    conversationId : Common.ConversationId,
    content : Text,
    messageType : MessagingTypes.MessageType,
    fileUrl : ?Text,
  ) : async Common.MessageId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to send messages");
    MessagingLib.sendMessage(messages, conversations, messagingState, caller, conversationId, content, messageType, fileUrl);
  };

  /// Get messages in a conversation (caller must be participant)
  public query ({ caller }) func getMessages(
    conversationId : Common.ConversationId
  ) : async [MessagingTypes.Message] {
    MessagingLib.getMessages(messages, conversations, caller, conversationId);
  };

  /// Get all conversations for the caller
  public query ({ caller }) func getConversations() : async [MessagingTypes.Conversation] {
    MessagingLib.getConversations(conversations, caller);
  };
};
