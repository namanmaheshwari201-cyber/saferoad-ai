import Map "mo:core/Map";
import Common "../types/common";
import ComplaintTypes "../types/complaint";
import ComplaintLib "../lib/complaint";
import Time "mo:core/Time";

mixin (
  complaints : Map.Map<Text, ComplaintTypes.Complaint>,
  complaintState : { var nextComplaintSeq : Nat }
) {
  public shared ({ caller }) func submitComplaint(
    input : ComplaintTypes.ComplaintInput
  ) : async Text {
    ComplaintLib.submitComplaint(complaints, complaintState, caller, input, Time.now());
  };

  public shared ({ caller }) func getUserComplaints() : async [ComplaintTypes.Complaint] {
    ComplaintLib.getUserComplaints(complaints, caller);
  };

  public shared query ({ caller }) func getComplaint(
    complaintId : Text
  ) : async ?ComplaintTypes.Complaint {
    ignore caller;
    ComplaintLib.getComplaint(complaints, complaintId);
  };

  public shared ({ caller }) func updateComplaintVerification(
    complaintId : Text,
    verification : Text,
    photoUrl : Text
  ) : async Bool {
    ComplaintLib.updateVerification(complaints, caller, complaintId, verification, photoUrl, Time.now());
  };

  public shared query ({ caller }) func getAllComplaints() : async [ComplaintTypes.Complaint] {
    ignore caller;
    ComplaintLib.getAllComplaints(complaints);
  };
};
