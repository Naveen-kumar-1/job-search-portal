import express from 'express'
import { changeJobApplicationStatus, changeJobVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, LoginCompany, postJob, registerCompany } from '../Controller/CompanyController.js'
import upload from '../config/multer.js'
import { productCompany } from '../middlewares/authMiddleWare.js'

const router = express.Router()

// Register a company 

router.post('/register',upload.single('image'),registerCompany)


//company login

router.post('/login',LoginCompany)

//Get company Data

router.get('/company',productCompany,getCompanyData)

//Post a job data 

router.post('/post-job',productCompany,postJob)

// Get applicants data of Company

router.get('/applicants',productCompany,getCompanyJobApplicants)

//get company job list

router.get('/list-jobs',productCompany,getCompanyPostedJobs)

//Change applicaion status

router.post('/change-status',productCompany,changeJobApplicationStatus)

//Change job visibility

router.post('/change-visibility',productCompany,changeJobVisibility)

export default router