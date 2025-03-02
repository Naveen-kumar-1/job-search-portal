import express from 'express'
import { getJobById, getJobs } from '../Controller/jobController.js';

const router = express.Router()

router.get('/', getJobs);  // Gets all jobs
router.get('/:id', getJobById);  // Gets a job by ID



export default router;