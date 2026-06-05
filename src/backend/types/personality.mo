// Types for Feature 17 — AI Cofounder Personality Engine
module {
  public type PersonalityId = Nat;

  public type AIPersonality = {
    id : PersonalityId;
    name : Text;
    description : Text;
    systemPrompt : Text;
    communicationStyle : Text;
    focusAreas : [Text];
  };
};
