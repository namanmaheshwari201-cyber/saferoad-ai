import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import MarketplaceLib "../lib/marketplace";
import MarketplaceTypes "../types/marketplace";
import Common "../types/common";
import Principal "mo:core/Principal";

mixin (
  listings : Map.Map<Common.ListingId, MarketplaceTypes.SkillListing>,
  orders : Map.Map<Common.OrderId, MarketplaceTypes.SkillOrder>,
  reviews : Map.Map<Common.ReviewId, MarketplaceTypes.Review>,
  marketplaceState : { var nextListingId : Nat; var nextOrderId : Nat; var nextReviewId : Nat },
) {
  /// Create a new skill listing
  public shared ({ caller }) func createSkillListing(
    listing : MarketplaceTypes.SkillListing
  ) : async Common.ListingId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to create a listing");
    MarketplaceLib.createListing(listings, marketplaceState, caller, listing);
  };

  /// Get all active listings, optionally filtered by category
  public query func getSkillListings(
    category : ?Text
  ) : async [MarketplaceTypes.SkillListing] {
    MarketplaceLib.getListings(listings, category);
  };

  /// Get a single listing by ID
  public query func getSkillListing(
    id : Common.ListingId
  ) : async ?MarketplaceTypes.SkillListing {
    MarketplaceLib.getListing(listings, id);
  };

  /// Place an order for a skill listing
  public shared ({ caller }) func createOrder(
    listingId : Common.ListingId,
    message : Text,
    sellerId : Common.UserId,
  ) : async Common.OrderId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to place an order");
    MarketplaceLib.createOrder(orders, marketplaceState, caller, listingId, message, sellerId);
  };

  /// Get all orders for the caller (as buyer or seller)
  public query ({ caller }) func getOrders() : async [MarketplaceTypes.SkillOrder] {
    MarketplaceLib.getOrders(orders, caller);
  };

  /// Add a review for a completed order
  public shared ({ caller }) func addReview(
    listingId : Common.ListingId,
    rating : Nat,
    comment : Text,
    sellerId : Common.UserId,
  ) : async Common.ReviewId {
    if (caller.isAnonymous()) Runtime.trap("Sign in to add a review");
    MarketplaceLib.addReview(reviews, listings, marketplaceState, caller, listingId, rating, comment, sellerId);
  };

  /// Search listings by keyword
  public query func searchListings(
    searchTerm : Text
  ) : async [MarketplaceTypes.SkillListing] {
    MarketplaceLib.searchListings(listings, searchTerm);
  };
};
