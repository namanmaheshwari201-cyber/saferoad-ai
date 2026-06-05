import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/launch";
import Order "mo:core/Order";

module {
  public func seedLaunches(
    launches : Map.Map<Types.LaunchId, Types.StartupLaunch>,
    state : { var nextLaunchId : Nat },
  ) {
    let samples : [(Text, Text, Text, Text, [Text])] = [
      (
        "EduAI",
        "AI-powered personalized tutoring for CBSE students",
        "EduAI adapts to each student's learning pace, generates practice questions, and provides instant doubt resolution for CBSE Class 9-12.",
        "https://eduai.example.com",
        ["EdTech", "AI", "Education"],
      ),
      (
        "GreenCart",
        "Hyperlocal marketplace for organic and sustainable products",
        "GreenCart connects local organic farmers directly with urban consumers, reducing middlemen and carbon footprint of food delivery by 60%.",
        "https://greencart.example.com",
        ["GreenTech", "FoodTech", "Sustainability"],
      ),
      (
        "MindSpace",
        "Mental wellness companion for students and young professionals",
        "MindSpace combines AI-guided journaling, peer support communities, and on-demand therapy sessions to make mental healthcare accessible and affordable.",
        "https://mindspace.example.com",
        ["MentalHealth", "Wellness", "AI"],
      ),
    ];
    for ((name, tagline, description, demoUrl, tags) in samples.values()) {
      let id = state.nextLaunchId;
      state.nextLaunchId += 1;
      launches.add(
        id,
        {
          id;
          founderId = Principal.anonymous();
          name;
          tagline;
          description;
          demoUrl;
          logoUrl = "";
          tags;
          launchDate = Time.now();
          votes = 0;
          followers = [];
          status = #live;
          createdAt = Time.now();
        },
      );
    };
  };

  public func listLaunches(
    launches : Map.Map<Types.LaunchId, Types.StartupLaunch>,
  ) : [Types.StartupLaunch] {
    launches.values().toArray();
  };

  public func getTrendingLaunches(
    launches : Map.Map<Types.LaunchId, Types.StartupLaunch>,
  ) : [Types.StartupLaunch] {
    let all = launches.values().toArray();
    all.sort(func(a : Types.StartupLaunch, b : Types.StartupLaunch) : Order.Order {
      if (a.votes > b.votes) #less
      else if (a.votes < b.votes) #greater
      else #equal
    });
  };

  public func getLaunch(
    launches : Map.Map<Types.LaunchId, Types.StartupLaunch>,
    launchId : Types.LaunchId,
  ) : ?Types.StartupLaunch {
    launches.get(launchId);
  };

  public func createLaunch(
    launches : Map.Map<Types.LaunchId, Types.StartupLaunch>,
    state : { var nextLaunchId : Nat },
    caller : Principal,
    name : Text,
    tagline : Text,
    description : Text,
    demoUrl : Text,
    logoUrl : Text,
    tags : [Text],
    launchDate : Int,
  ) : Types.StartupLaunch {
    let id = state.nextLaunchId;
    state.nextLaunchId += 1;
    let launch : Types.StartupLaunch = {
      id;
      founderId = caller;
      name;
      tagline;
      description;
      demoUrl;
      logoUrl;
      tags;
      launchDate;
      votes = 0;
      followers = [];
      status = #upcoming;
      createdAt = Time.now();
    };
    launches.add(id, launch);
    launch;
  };

  public func voteLaunch(
    launches : Map.Map<Types.LaunchId, Types.StartupLaunch>,
    launchId : Types.LaunchId,
    _caller : Principal,
  ) : Bool {
    switch (launches.get(launchId)) {
      case null { false };
      case (?l) {
        launches.add(launchId, { l with votes = l.votes + 1 });
        true;
      };
    };
  };

  public func followLaunch(
    launches : Map.Map<Types.LaunchId, Types.StartupLaunch>,
    caller : Principal,
    launchId : Types.LaunchId,
  ) : Bool {
    switch (launches.get(launchId)) {
      case null { false };
      case (?l) {
        let alreadyFollowing = l.followers.find(func(p : Principal) : Bool { p == caller });
        if (alreadyFollowing != null) {
          return false;
        };
        launches.add(launchId, { l with followers = l.followers.concat([caller]) });
        true;
      };
    };
  };

  public func joinWaitlist(
    waitlist : Map.Map<Types.WaitlistId, Types.LaunchWaitlist>,
    state : { var nextWaitlistId : Nat },
    launchId : Types.LaunchId,
    caller : Principal,
    email : Text,
  ) : Types.LaunchWaitlist {
    let id = state.nextWaitlistId;
    state.nextWaitlistId += 1;
    let entry : Types.LaunchWaitlist = {
      id;
      launchId;
      userId = caller;
      email;
      joinedAt = Time.now();
    };
    waitlist.add(id, entry);
    entry;
  };
};
