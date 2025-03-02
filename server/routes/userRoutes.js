import express from 'express'
import { applyForAJob, getUserData, getUserJobApplication, updateUserResume } from '../Controller/UserController.js'
import upload from '../config/multer.js'

const router = express.Router()

// Get user Data

router.get('/user',getUserData)

// Apply for a job

router.post('/apply',applyForAJob)

// Get Applied Job Data

router.get('/applications',getUserJobApplication)

// Update user Profile(Resume)

router.post('/update-resume',upload.single('resume'),updateUserResume)

export default router