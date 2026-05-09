import express from "express";

import{createComplaint,getComplaints,getComplaintById,updateComplaintStatus,addResponse,deleteComplaint} from "../controllers/complaintController.js";

const router=express.Router();


router.post("/",createComplaint);
router.get("/",getComplaints);
router.get("/:id",getComplaintById);
router.put("/:id/status",updateComplaintStatus);
router.put("/:id/response",addResponse);
router.delete("/:id",deleteComplaint);
export default router;