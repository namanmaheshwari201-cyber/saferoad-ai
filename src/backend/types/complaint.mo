import Common "common";

module {
  public type Complaint = {
    complaintId : Text;
    userId : Common.UserId;
    complaintType : Text;
    locationLat : Float;
    locationLng : Float;
    locationAddress : Text;
    description : Text;
    photoUrl : Text;
    status : Text;
    assignedAuthority : Text;
    aiAnalysisResult : Text;
    aiSeverity : Text;
    citizenVerification : Text;
    verificationPhotoUrl : Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type ComplaintInput = {
    complaintType : Text;
    locationLat : Float;
    locationLng : Float;
    locationAddress : Text;
    description : Text;
    photoUrl : Text;
  };
};
