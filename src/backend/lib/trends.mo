import Map "mo:core/Map";
import Types "../types/trends";

module {
  public func seedTrends(
    trends : Map.Map<Types.TrendId, Types.TrendReport>,
    opportunities : Map.Map<Types.OpportunityId, Types.StartupOpportunity>,
    state : { var nextTrendId : Nat; var nextOpportunityId : Nat },
  ) {
    let trendData : [(Text, Nat, Nat, Text, Text, Text, [Text])] = [
      (
        "EdTech",
        92,
        88,
        "Medium",
        "+34% YoY",
        "Online education is exploding post-pandemic. AI tutors, skill marketplaces, and micro-credentials are disrupting traditional degrees.",
        ["education", "ai", "elearning", "skills"],
      ),
      (
        "FinTech",
        85,
        75,
        "High",
        "+22% YoY",
        "Embedded finance, crypto wallets, and BNPL are reshaping payments and banking, especially in emerging markets.",
        ["finance", "payments", "crypto", "banking"],
      ),
      (
        "HealthTech",
        88,
        82,
        "Medium",
        "+41% YoY",
        "Remote diagnostics, AI-driven early detection, and mental health apps are transforming healthcare access globally.",
        ["health", "ai", "telemedicine", "wellness"],
      ),
      (
        "GreenTech",
        78,
        90,
        "Low",
        "+67% YoY",
        "Climate urgency is unlocking massive capital. Carbon tracking, clean energy, and circular economy startups have low competition and policy tailwinds.",
        ["climate", "sustainability", "energy", "carbon"],
      ),
      (
        "AI Tools",
        97,
        85,
        "High",
        "+120% YoY",
        "Every vertical is being re-built with AI. Copilots, agents, and automation tools for niche workflows have enormous demand.",
        ["ai", "automation", "productivity", "llm"],
      ),
      (
        "Gaming & Creator Economy",
        80,
        72,
        "High",
        "+18% YoY",
        "Web3 gaming, creator monetization tools, and live commerce are converging. Niche community platforms are outperforming generic social media.",
        ["gaming", "creator", "web3", "content"],
      ),
      (
        "FoodTech",
        70,
        68,
        "Medium",
        "+15% YoY",
        "Ghost kitchens, hyperlocal delivery, and alternative proteins are reshaping food supply chains.",
        ["food", "delivery", "agri", "sustainability"],
      ),
      (
        "Logistics & Supply Chain",
        74,
        71,
        "Medium",
        "+19% YoY",
        "Real-time visibility, last-mile optimization, and autonomous warehousing are creating new infrastructure layers.",
        ["logistics", "supply-chain", "automation", "delivery"],
      ),
      (
        "Mental Health",
        86,
        91,
        "Low",
        "+55% YoY",
        "Digital therapy, AI companions, and employer wellness programs are growing fast with very low market saturation.",
        ["mental-health", "wellness", "therapy", "b2b"],
      ),
      (
        "SaaS Tools for SMBs",
        82,
        80,
        "Medium",
        "+27% YoY",
        "Small businesses are adopting vertical SaaS faster than ever. Niche industry software (salons, gyms, local services) is highly profitable.",
        ["saas", "smb", "vertical", "software"],
      ),
      (
        "Web3 & Blockchain",
        65,
        62,
        "High",
        "+8% YoY",
        "Despite market cycles, real-world asset tokenization, DeFi, and identity on-chain are building durable infrastructure.",
        ["web3", "blockchain", "defi", "nft"],
      ),
      (
        "Space & Deep Tech",
        60,
        77,
        "Low",
        "+44% YoY",
        "Commercial space, synthetic biology, and quantum computing are entering commercialization phase with enormous long-term upside.",
        ["space", "deeptech", "biotech", "quantum"],
      ),
    ];
    for (
      (industry, trendScore, opportunityScore, saturationLevel, growthRate, description, tags)
      in trendData.values()
    ) {
      let id = state.nextTrendId;
      state.nextTrendId += 1;
      trends.add(
        id,
        { id; industry; trendScore; opportunityScore; saturationLevel; growthRate; description; tags },
      );
    };
    let oppData : [(Text, Text, Text, Text, Text, Nat)] = [
      (
        "AI Study Assistant for CBSE Students",
        "K-12 EdTech India",
        "Very High",
        "Low",
        "Build an AI tutor that adapts to CBSE syllabus, provides instant doubt resolution, and generates personalized practice papers. Target Tier-2 cities.",
        0,
      ),
      (
        "Carbon Footprint Tracker for SMEs",
        "GreenTech B2B",
        "High",
        "Low",
        "Help small businesses measure, report, and offset their carbon emissions to comply with emerging ESG regulations. Subscription model.",
        3,
      ),
      (
        "Mental Wellness App for Students",
        "Mental Health EdTech",
        "Very High",
        "Low",
        "Combine journaling, AI emotional support, and peer communities for college students facing academic pressure. Partner with universities.",
        8,
      ),
      (
        "Hyperlocal Skill Marketplace",
        "Gig Economy",
        "High",
        "Medium",
        "Connect local freelancers (graphic designers, video editors, tutors) with businesses in Tier-2 cities where urban platforms don't serve well.",
        9,
      ),
      (
        "AI-Powered Legal Document Generator",
        "LegalTech SaaS",
        "High",
        "Low",
        "Automate standard legal documents (NDAs, contracts, MSME filings) for small businesses. 80% of SMBs can't afford traditional lawyers.",
        9,
      ),
      (
        "Creator Monetization OS",
        "Creator Economy",
        "High",
        "Medium",
        "An all-in-one platform for creators to manage subscriptions, digital products, affiliate programs, and analytics — without multiple tools.",
        5,
      ),
    ];
    for ((title, niche, demand, competition, aiSuggestion, relatedTrendId) in oppData.values()) {
      let id = state.nextOpportunityId;
      state.nextOpportunityId += 1;
      opportunities.add(
        id,
        { id; title; niche; demand; competition; aiSuggestion; relatedTrendId },
      );
    };
  };

  public func listTrends(
    trends : Map.Map<Types.TrendId, Types.TrendReport>,
  ) : [Types.TrendReport] {
    trends.values().toArray();
  };

  public func searchTrends(
    trends : Map.Map<Types.TrendId, Types.TrendReport>,
    searchQuery : Text,
  ) : [Types.TrendReport] {
    let lower = searchQuery.toLower();
    trends.values().filter(func(t) : Bool {
      t.industry.toLower().contains(#text lower)
        or t.description.toLower().contains(#text lower)
        or t.tags.find(func(tag : Text) : Bool { tag.toLower().contains(#text lower) }) != null
    }).toArray();
  };

  public func listOpportunities(
    opportunities : Map.Map<Types.OpportunityId, Types.StartupOpportunity>,
  ) : [Types.StartupOpportunity] {
    opportunities.values().toArray();
  };
};
