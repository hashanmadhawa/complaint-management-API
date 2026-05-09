import mongoose from "mongoose";

const complaintSchema= new mongoose.Schema(
{
    title:{
        type:String,
        required:true
        },
    description:{
        type:String,
        required:true
    },
    catagory:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","in_progress","resolved"],
        default:"pending",
    },
    response:{
        type:String,
        default:"",
    }
    

    },{
        timestamps:true,
    }

);
const Complaint=mongoose.model("Complaint",complaintSchema);
export default Complaint;