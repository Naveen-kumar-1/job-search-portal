import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import {v2 as cloudinary} from 'cloudinary'
import Job from "../models/job.js"



// Get user Data
export const getUserData = async(req,res)=>{

    const userId = req.auth.userId
    
    try {
        
        const user = await User.findById(userId)
        if (!user) {
            return res.json({success:false,message:"User not found"})
        }
        res.json({success:true,user})

    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
    

}

// Apply for a job

export const applyForAJob = async(req,res)=>{
    const {jobId}=req.body
    const userId = req.auth.userId
    try {
        const isAlreadyApplied = await JobApplication.find({jobId,userId})
        if(isAlreadyApplied.length >0){
            return res.json({success:false,message:"Already Applied"})

        }
        const jobData = await Job.findById(jobId)
        if (!jobData) {
            return res.json({success:false,message:"Job not found"})

        }
        await JobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date:Date.now(),

        })
        res.json({success:true,message:"Applied Successfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

}

// Fetch job application Data

export const getUserJobApplication = async(req,res)=>{
    try {
        const userId = req.auth.userId

        const application = await JobApplication.find({userId}).populate('companyId','name email image').populate('jobId','title description location category level salary').exec()
        if (!application) {
            return res.json({success:false,message:"No Job APplication found for this user"})
            
        }
        res.json({success:true,application})

    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

// Update user profile 

export const updateUserResume = async(req,res)=>{
    try {
        const userId = req.auth.userId
        

        const resumeFile = req.file

        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url  
        }

        await userData.save()

        return res.json({success:true,message:"Resume Updated"})


    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

}
