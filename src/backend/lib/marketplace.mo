import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../types/marketplace";
import Common "../types/common";

module {
  public func createListing(
    listings : Map.Map<Common.ListingId, Types.SkillListing>,
    state : { var nextListingId : Nat },
    caller : Common.UserId,
    listing : Types.SkillListing,
  ) : Common.ListingId {
    let id = state.nextListingId;
    state.nextListingId += 1;
    let normalized : Types.SkillListing = {
      listing with
      id;
      sellerId = caller;
      rating = 0;
      reviewCount = 0;
      orderCount = 0;
      createdAt = Time.now();
      isActive = true;
    };
    listings.add(id, normalized);
    id;
  };

  public func getListings(
    listings : Map.Map<Common.ListingId, Types.SkillListing>,
    category : ?Text,
  ) : [Types.SkillListing] {
    let active = listings.entries().filter(func((_, l) : (Common.ListingId, Types.SkillListing)) : Bool { l.isActive });
    let mapped = active.map(func((_, l) : (Common.ListingId, Types.SkillListing)) : Types.SkillListing { l });
    switch (category) {
      case (null) mapped.toArray();
      case (?cat) {
        let catLower = cat.toLower();
        mapped.filter(func(l : Types.SkillListing) : Bool {
          l.category.toLower() == catLower;
        }).toArray();
      };
    };
  };

  public func getListing(
    listings : Map.Map<Common.ListingId, Types.SkillListing>,
    id : Common.ListingId,
  ) : ?Types.SkillListing {
    listings.get(id);
  };

  public func createOrder(
    orders : Map.Map<Common.OrderId, Types.SkillOrder>,
    state : { var nextOrderId : Nat },
    caller : Common.UserId,
    listingId : Common.ListingId,
    message : Text,
    sellerId : Common.UserId,
  ) : Common.OrderId {
    let id = state.nextOrderId;
    state.nextOrderId += 1;
    let order : Types.SkillOrder = {
      id;
      listingId;
      buyerId = caller;
      sellerId;
      status = #pending;
      message;
      createdAt = Time.now();
      completedAt = null;
    };
    orders.add(id, order);
    id;
  };

  public func getOrders(
    orders : Map.Map<Common.OrderId, Types.SkillOrder>,
    caller : Common.UserId,
  ) : [Types.SkillOrder] {
    orders.entries().filter(func((_, o) : (Common.OrderId, Types.SkillOrder)) : Bool {
      Principal.equal(o.buyerId, caller) or Principal.equal(o.sellerId, caller);
    }).map(func((_, o) : (Common.OrderId, Types.SkillOrder)) : Types.SkillOrder { o })
      .toArray();
  };

  public func addReview(
    reviews : Map.Map<Common.ReviewId, Types.Review>,
    listings : Map.Map<Common.ListingId, Types.SkillListing>,
    state : { var nextReviewId : Nat },
    caller : Common.UserId,
    listingId : Common.ListingId,
    rating : Nat,
    comment : Text,
    sellerId : Common.UserId,
  ) : Common.ReviewId {
    let id = state.nextReviewId;
    state.nextReviewId += 1;
    let review : Types.Review = {
      id;
      listingId;
      reviewerId = caller;
      sellerId;
      rating;
      comment;
      createdAt = Time.now();
    };
    reviews.add(id, review);
    switch (listings.get(listingId)) {
      case (?listing) {
        let listingReviews = reviews.entries().filter(func((_, r) : (Common.ReviewId, Types.Review)) : Bool { r.listingId == listingId }).map(
          func((_, r) : (Common.ReviewId, Types.Review)) : Types.Review { r }
        ).toArray();
        let total = listingReviews.foldLeft(0, func(acc : Nat, r : Types.Review) : Nat { acc + r.rating });
        let count = listingReviews.size();
        let avgRating = if (count > 0) (total * 10) / count else 0;
        let updated : Types.SkillListing = {
          listing with
          rating = avgRating;
          reviewCount = count;
          orderCount = listing.orderCount + 1;
        };
        listings.add(listingId, updated);
      };
      case null {};
    };
    id;
  };

  public func searchListings(
    listings : Map.Map<Common.ListingId, Types.SkillListing>,
    searchTerm : Text,
  ) : [Types.SkillListing] {
    let term = searchTerm.toLower();
    listings.entries().filter(func((_, l) : (Common.ListingId, Types.SkillListing)) : Bool {
      l.isActive and (
        l.title.toLower().contains(#text term) or
        l.category.toLower().contains(#text term) or
        l.tags.find(func(t : Text) : Bool { t.toLower().contains(#text term) }) != null
      );
    }).map(func((_, l) : (Common.ListingId, Types.SkillListing)) : Types.SkillListing { l })
      .toArray();
  };
};
