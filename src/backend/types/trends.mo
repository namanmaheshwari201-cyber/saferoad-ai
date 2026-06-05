// Types for Feature 18 — AI Market Trend Detector
module {
  public type TrendId = Nat;
  public type OpportunityId = Nat;

  public type TrendReport = {
    id : TrendId;
    industry : Text;
    trendScore : Nat;
    opportunityScore : Nat;
    saturationLevel : Text;
    growthRate : Text;
    description : Text;
    tags : [Text];
  };

  public type StartupOpportunity = {
    id : OpportunityId;
    title : Text;
    niche : Text;
    demand : Text;
    competition : Text;
    aiSuggestion : Text;
    relatedTrendId : TrendId;
  };
};
