import Complaint from "../models/Complaint.js";

export const createComplaint = async (req,res)=>{
    try{
        const complaint = await Complaint.create({
            ...req.body,
            status: "pending",
        });
        res.status(201).json({
            success:true,
            data:complaint,
        });
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        });
    }
};

export const getComplaints=async(req,res)=>{
    try{
        const complaints=await Complaint.find();
        res.status(200).json({
            success:true,
            count:complaints.length,
            data:complaints,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {

    // ✅ Block any request that doesn't include a valid status field
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: status },        // ✅ Only status is ever updated here
      { new: true, runValidators: true }  // runValidators enforces the enum check
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Response
export const addResponse = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { response: req.body.response },
      {new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Complaint
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};