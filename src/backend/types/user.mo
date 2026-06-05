import Common "common";

module {
  public type UserProfile = {
    principal : Common.UserId;
    name : Text;
    phone : Text;
    state : Text;
    city : Text;
    language : Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type UserProfileInput = {
    name : Text;
    phone : Text;
    state : Text;
    city : Text;
    language : Text;
  };

  public type EmergencyProfile = {
    principal : Common.UserId;
    bloodGroup : Text;
    allergies : Text;
    medicalConditions : Text;
    emergencyContact1Name : Text;
    emergencyContact1Phone : Text;
    emergencyContact2Name : Text;
    emergencyContact2Phone : Text;
    insuranceProvider : Text;
    policyNumber : Text;
    additionalNotes : Text;
    updatedAt : Common.Timestamp;
  };

  public type EmergencyProfileInput = {
    bloodGroup : Text;
    allergies : Text;
    medicalConditions : Text;
    emergencyContact1Name : Text;
    emergencyContact1Phone : Text;
    emergencyContact2Name : Text;
    emergencyContact2Phone : Text;
    insuranceProvider : Text;
    policyNumber : Text;
    additionalNotes : Text;
  };
};
