
//Register a new company 

import bcrypt from 'bcrypt'
import {v2 as cloudinary}  from 'cloudinary'
 import Company from "../models/Company.js"
import generateToken from "../utils/generateToken.js"
import Job from '../models/job.js'
import JobApplication from '../models/JobApplication.js'

export const registerCompany = async (req,res)=>{

    const {name,email,password}=req.body

    const ImageFile = req.file

    if (!name || !email || !password || !ImageFile) {
        return res.json({success:false,message:"Missing Details"})

    }
    try {
        const companyExist = await Company.findOne({email})

        if(companyExist){
            return res.json({success:false,message:"The Company is already Registred"})
        }
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password,salt)

            const imageUpload = await cloudinary.uploader.upload(ImageFile.path)

            const company = await Company.create({
                name,
                email,
                password:hashPassword,
                image:imageUpload.secure_url
            })
            res.json({
                success:true,
                company:{
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image,
                },
                token:generateToken(company._id)

            })

    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

}

// Company Login

export const LoginCompany = async (req,res)=>{
    const {email,password} = req.body

    try {
        const company = await Company.findOne({email})
        if(await bcrypt.compare(password,company.password)){
res.json({
    success:true,
    company:{
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
    },
    token:generateToken(company._id)

} )

        }else{
            res.json({success:false,message:"Invalid email or password"})
        }
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

//Get Company data
export const getCompanyData = async (req,res)=>{

    try {
    const company = req.company
        res.json({success:true,company})
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

//Post a new job

export const postJob = async (req,res)=>{
    const {title,description,location,salary,level,category} = req.body
    
    const  companyId = req.company._id
    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date:Date.now(),
            level,
            category
        }) 
        await newJob.save()

        res.json({success:true,newJob})

    } catch (error) {
        res.json({success:false,message:error.message})
        
    }    

}

// Get the Job appicants

export const getCompanyJobApplicants = async (req,res)=>{
    try {
        const companyId = req.company._id

        // Find Job applications for the user and populate related data

        const applications = await JobApplication.find({ companyId })
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()
        return res.json({success:true,applications})



    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

}

// get Company posted jobs

export const getCompanyPostedJobs = async (req,res)=>{
    try {
        const companyId = req.company._id
        const jobs=await Job.find({companyId})
        const jobsData = await Promise.all(jobs.map(async (job)=>{
            const applicants = await JobApplication.find({jobId:job._id})
            return {...job.toObject(),applicants:applicants.length}
        }))
        res.json({success:true,jobsData})
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

}

// Chage Job Applcations status 
export const changeJobApplicationStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            return res.status(400).json({ success: false, message: "ID and status are required" });
        }

        // Find job application and update status
        const updatedApplication = await JobApplication.findOneAndUpdate(
            { _id: id },
            { status },
            { new: true } // ✅ Return updated document
        );

        if (!updatedApplication) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        res.status(200).json({ success: true, message: "Status Changed", application: updatedApplication });

    } catch (error) {
        console.error("Error updating job application status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//Change job visibility

export const changeJobVisibility = async (req,res)=>{

    try {
        const {id} = req.body

        const companyId = req.company._id

        const job = await Job.findById(id)

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible
            
        }

        await job.save()
        res.json({success:true,job})


    } catch (error) {
        res.json({success:false,message:error.message})
    }

}