import Map "mo:core/Map";
import Common "../types/common";
import ComplaintTypes "../types/complaint";
import List "mo:core/List";

module {
  public func submitComplaint(
    complaints : Map.Map<Text, ComplaintTypes.Complaint>,
    state : { var nextComplaintSeq : Nat },
    caller : Common.UserId,
    input : ComplaintTypes.ComplaintInput,
    now : Common.Timestamp
  ) : Text {
    let seq = state.nextComplaintSeq;
    state.nextComplaintSeq += 1;
    let year = "2025";
    let id = "CT-" # year # "-" # (10000 + seq).toText();
    let complaint : ComplaintTypes.Complaint = {
      complaintId = id;
      userId = caller;
      complaintType = input.complaintType;
      locationLat = input.locationLat;
      locationLng = input.locationLng;
      locationAddress = input.locationAddress;
      description = input.description;
      photoUrl = input.photoUrl;
      status = "submitted";
      assignedAuthority = "";
      aiAnalysisResult = "";
      aiSeverity = "medium";
      citizenVerification = "";
      verificationPhotoUrl = "";
      createdAt = now;
      updatedAt = now;
    };
    complaints.add(id, complaint);
    id;
  };

  public func getUserComplaints(
    complaints : Map.Map<Text, ComplaintTypes.Complaint>,
    caller : Common.UserId
  ) : [ComplaintTypes.Complaint] {
    let buf = List.empty<ComplaintTypes.Complaint>();
    for ((_, c) in complaints.entries()) {
      if (c.userId == caller) { buf.add(c) };
    };
    buf.toArray();
  };

  public func getComplaint(
    complaints : Map.Map<Text, ComplaintTypes.Complaint>,
    complaintId : Text
  ) : ?ComplaintTypes.Complaint {
    complaints.get(complaintId);
  };

  public func updateVerification(
    complaints : Map.Map<Text, ComplaintTypes.Complaint>,
    caller : Common.UserId,
    complaintId : Text,
    verification : Text,
    photoUrl : Text,
    now : Common.Timestamp
  ) : Bool {
    switch (complaints.get(complaintId)) {
      case (?c) {
        if (c.userId != caller) { return false };
        complaints.add(complaintId, { c with citizenVerification = verification; verificationPhotoUrl = photoUrl; updatedAt = now });
        true;
      };
      case null { false };
    };
  };

  public func getAllComplaints(
    complaints : Map.Map<Text, ComplaintTypes.Complaint>
  ) : [ComplaintTypes.Complaint] {
    let buf = List.empty<ComplaintTypes.Complaint>();
    for ((_, c) in complaints.entries()) { buf.add(c) };
    buf.toArray();
  };
};
