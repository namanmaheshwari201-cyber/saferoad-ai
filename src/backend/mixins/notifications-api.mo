import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import NotificationsLib "../lib/notifications";
import NotificationsTypes "../types/notifications";
import Common "../types/common";
import Principal "mo:core/Principal";

mixin (
  notifications : Map.Map<Common.NotificationId, NotificationsTypes.Notification>,
  notificationState : { var nextNotificationId : Nat },
) {
  /// Get all notifications for the caller
  public query ({ caller }) func getNotifications() : async [NotificationsTypes.Notification] {
    NotificationsLib.getNotifications(notifications, caller);
  };

  /// Mark a notification as read
  public shared ({ caller }) func markNotificationRead(
    notificationId : Common.NotificationId
  ) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in to manage notifications");
    NotificationsLib.markNotificationRead(notifications, caller, notificationId);
  };
};
