import List "mo:core/List";
import Common "../types/common";
import RoadwatchTypes "../types/roadwatch";

module {
  public func getRoadProjects(
    projects : List.List<RoadwatchTypes.RoadProject>,
    state : Text
  ) : [RoadwatchTypes.RoadProject] {
    if (state == "") {
      projects.toArray();
    } else {
      projects.filter(func(p) { p.state == state }).toArray();
    };
  };

  public func getContractors(
    contractors : List.List<RoadwatchTypes.Contractor>,
    state : Text
  ) : [RoadwatchTypes.Contractor] {
    if (state == "") {
      contractors.toArray();
    } else {
      contractors.filter(func(c) { c.state == state }).toArray();
    };
  };

  public func getLegalUpdates(
    updates : List.List<RoadwatchTypes.LegalUpdate>,
    state : Text,
    topic : Text
  ) : [RoadwatchTypes.LegalUpdate] {
    updates.filter(func(u) {
      (state == "" or u.state == state or u.state == "All") and
      (topic == "" or u.topic == topic)
    }).toArray();
  };

  public func seedRoadData(
    projects : List.List<RoadwatchTypes.RoadProject>,
    contractors : List.List<RoadwatchTypes.Contractor>,
    updates : List.List<RoadwatchTypes.LegalUpdate>,
    state : { var nextProjectId : Nat; var nextContractorId : Nat; var nextUpdateId : Nat }
  ) : () {
    if (projects.size() > 0) { return };

    let seedProjects : [RoadwatchTypes.RoadProject] = [
      { projectId = 0; name = "Delhi-Meerut Expressway Phase 3"; location = "NH-58, Ghaziabad"; state = "Uttar Pradesh"; totalBudget = 850000000.0; releasedBudget = 680000000.0; utilizedBudget = 612000000.0; contractorName = "Dilip Buildcon Ltd"; completionPercent = 72.0; lastUpdated = 0 },
      { projectId = 1; name = "Mumbai Coastal Road South"; location = "Marine Lines, Mumbai"; state = "Maharashtra"; totalBudget = 1200000000.0; releasedBudget = 900000000.0; utilizedBudget = 856000000.0; contractorName = "HCC Ltd"; completionPercent = 65.0; lastUpdated = 0 },
      { projectId = 2; name = "Bengaluru Peripheral Ring Road"; location = "Tumkur Road Junction"; state = "Karnataka"; totalBudget = 1500000000.0; releasedBudget = 450000000.0; utilizedBudget = 380000000.0; contractorName = "NCC Ltd"; completionPercent = 28.0; lastUpdated = 0 },
      { projectId = 3; name = "Chennai Outer Ring Road Upgrade"; location = "Ambattur-Vanagaram"; state = "Tamil Nadu"; totalBudget = 620000000.0; releasedBudget = 620000000.0; utilizedBudget = 598000000.0; contractorName = "L&T Infrastructure"; completionPercent = 96.0; lastUpdated = 0 },
      { projectId = 4; name = "Pune-Nashik Highway NH-60"; location = "Chakan, Pune"; state = "Maharashtra"; totalBudget = 980000000.0; releasedBudget = 490000000.0; utilizedBudget = 420000000.0; contractorName = "Gayatri Projects"; completionPercent = 44.0; lastUpdated = 0 },
      { projectId = 5; name = "Hyderabad Outer Ring Road Phase 2"; location = "Shamshabad, Hyderabad"; state = "Telangana"; totalBudget = 750000000.0; releasedBudget = 712000000.0; utilizedBudget = 698000000.0; contractorName = "Megha Engineering"; completionPercent = 91.0; lastUpdated = 0 }
    ];
    let seedContractors : [RoadwatchTypes.Contractor] = [
      { contractorId = 0; name = "Dilip Buildcon Ltd"; state = "Madhya Pradesh"; qualityScore = 82.0; timelineScore = 78.0; complaintScore = 88.0; overallScore = 82.0; projectsCompleted = 47; status = "active" },
      { contractorId = 1; name = "HCC Ltd"; state = "Maharashtra"; qualityScore = 88.0; timelineScore = 85.0; complaintScore = 90.0; overallScore = 87.5; projectsCompleted = 63; status = "active" },
      { contractorId = 2; name = "NCC Ltd"; state = "Telangana"; qualityScore = 79.0; timelineScore = 72.0; complaintScore = 81.0; overallScore = 77.0; projectsCompleted = 38; status = "active" },
      { contractorId = 3; name = "L&T Infrastructure"; state = "Tamil Nadu"; qualityScore = 93.0; timelineScore = 91.0; complaintScore = 95.0; overallScore = 93.0; projectsCompleted = 112; status = "active" },
      { contractorId = 4; name = "Gayatri Projects"; state = "Andhra Pradesh"; qualityScore = 75.0; timelineScore = 68.0; complaintScore = 76.0; overallScore = 73.0; projectsCompleted = 29; status = "active" }
    ];
    let seedUpdates : [RoadwatchTypes.LegalUpdate] = [
      { updateId = 0; title = "MV Amendment Act 2019 — Enhanced Penalties"; summary = "Motor Vehicles Amendment Act 2019 drastically increased fines: overspeeding ₹1000-2000, drunk driving ₹10000, no helmet ₹1000 with 3-month licence suspension."; state = "All"; topic = "fines"; publishedAt = 0; sourceUrl = "https://morth.nic.in" },
      { updateId = 1; title = "Delhi Odd-Even Scheme 2024 Update"; summary = "Delhi NCT revised odd-even vehicle restriction scheme. Two-wheelers and CNG vehicles exempt. Violations: ₹2000 fine."; state = "Delhi"; topic = "restrictions"; publishedAt = 0; sourceUrl = "https://transport.delhi.gov.in" },
      { updateId = 2; title = "Maharashtra Helmet Rule — Both Rider & Pillion"; summary = "Maharashtra mandates ISI-certified helmet for both rider and pillion. Fine for non-compliance: ₹1000 + 3-month suspension."; state = "Maharashtra"; topic = "helmet"; publishedAt = 0; sourceUrl = "https://transport.maharashtra.gov.in" },
      { updateId = 3; title = "Fastag Mandatory for All Vehicles"; summary = "National Highway tolls now mandate Fastag. Vehicles without Fastag charged double toll. Applies to all NHs across India."; state = "All"; topic = "tolls"; publishedAt = 0; sourceUrl = "https://ihmcl.com" },
      { updateId = 4; title = "Karnataka Speed Camera Rollout 2024"; summary = "Karnataka government deployed 250 AI speed cameras on state highways. Challans auto-generated for violations above 80 km/h in urban zones."; state = "Karnataka"; topic = "speed"; publishedAt = 0; sourceUrl = "https://ksp.gov.in" }
    ];
    for (p in seedProjects.vals()) { projects.add(p) };
    for (c in seedContractors.vals()) { contractors.add(c) };
    for (u in seedUpdates.vals()) { updates.add(u) };
    state.nextProjectId := 6;
    state.nextContractorId := 5;
    state.nextUpdateId := 5;
  };
};
