import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Types "../types/notifications";
import Common "../types/common";

module {
  public func createNotification(
    notifications : Map.Map<Common.NotificationId, Types.Notification>,
    state : { var nextNotificationId : Nat },
    userId : Common.UserId,
    notifType : Text,
    title : Text,
    message : Text,
    relatedId : ?Nat,
  ) : () {
    let id = state.nextNotificationId;
    state.nextNotificationId += 1;
    notifications.add(id, {
      id; userId; notifType; title; message;
      isRead = false; relatedId;
      createdAt = Time.now();
    });
  };

  public func getNotifications(
    notifications : Map.Map<Common.NotificationId, Types.Notification>,
    caller : Common.UserId,
  ) : [Types.Notification] {
    notifications.entries().filter(func((_, n) : (Common.NotificationId, Types.Notification)) : Bool {
      Principal.equal(n.userId, caller);
    }).map(func((_, n) : (Common.NotificationId, Types.Notification)) : Types.Notification { n })
      .toArray();
  };

  public func markNotificationRead(
    notifications : Map.Map<Common.NotificationId, Types.Notification>,
    caller : Common.UserId,
    notificationId : Common.NotificationId,
  ) : () {
    switch (notifications.get(notificationId)) {
      case (?notif) {
        if (not Principal.equal(notif.userId, caller)) return;
        notifications.add(notificationId, { notif with isRead = true });
      };
      case null {};
    };
  };
};
