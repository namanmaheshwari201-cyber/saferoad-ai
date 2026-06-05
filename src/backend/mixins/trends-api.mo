import Map "mo:core/Map";
import TrendsLib "../lib/trends";
import TrendsTypes "../types/trends";

mixin (
  trends : Map.Map<TrendsTypes.TrendId, TrendsTypes.TrendReport>,
  opportunities : Map.Map<TrendsTypes.OpportunityId, TrendsTypes.StartupOpportunity>,
) {
  /// List all market trend reports
  public query func getTrendReports() : async [TrendsTypes.TrendReport] {
    TrendsLib.listTrends(trends);
  };

  /// Search trend reports by keyword
  public query func searchTrends(searchQuery : Text) : async [TrendsTypes.TrendReport] {
    TrendsLib.searchTrends(trends, searchQuery);
  };

  /// List all startup opportunities
  public query func getOpportunities() : async [TrendsTypes.StartupOpportunity] {
    TrendsLib.listOpportunities(opportunities);
  };
};
