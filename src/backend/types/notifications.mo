import Common "common";

module {
  public type Notification = {
    id : Common.NotificationId;
    userId : Common.UserId;
    notifType : Text;
    title : Text;
    message : Text;
    isRead : Bool;
    relatedId : ?Nat;
    createdAt : Common.Timestamp;
  };
};
