import Common "common";

module {
  public type SkillListing = {
    id : Common.ListingId;
    sellerId : Common.UserId;
    title : Text;
    description : Text;
    category : Text;
    price : Nat;
    deliveryDays : Nat;
    tags : [Text];
    portfolioImageUrls : [Text];
    rating : Nat; // stored as 0-50 (multiply by 0.1 for display)
    reviewCount : Nat;
    orderCount : Nat;
    createdAt : Common.Timestamp;
    isActive : Bool;
  };

  public type OrderStatus = { #pending; #active; #completed; #cancelled };

  public type SkillOrder = {
    id : Common.OrderId;
    listingId : Common.ListingId;
    buyerId : Common.UserId;
    sellerId : Common.UserId;
    status : OrderStatus;
    message : Text;
    createdAt : Common.Timestamp;
    completedAt : ?Common.Timestamp;
  };

  public type Review = {
    id : Common.ReviewId;
    listingId : Common.ListingId;
    reviewerId : Common.UserId;
    sellerId : Common.UserId;
    rating : Nat; // 1-5
    comment : Text;
    createdAt : Common.Timestamp;
  };
};
