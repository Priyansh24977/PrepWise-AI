import express from 'express';
import authUser from '../middlewares/auth.middlewares.js';
import { 
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController, 
    generateResumePdfController,
    downloadReportPdfController
} from '../controllers/interview.controller.js';
import upload from '../middlewares/file.middleware.js';

const interviewRouter = express.Router();

// Generate new interview report
interviewRouter.post('/', authUser, upload.single("resume"), generateInterviewReportController);

// Get all interview reports for user
interviewRouter.get('/', authUser, getAllInterviewReportsController);

// Get single report by ID
interviewRouter.get('/report/:interviewId', authUser, getInterviewReportByIdController);
interviewRouter.get('/:id', authUser, getInterviewReportByIdController);

// Download Interview Report PDF
interviewRouter.get('/:id/pdf', authUser, downloadReportPdfController);

// Generate resume PDF based on report
interviewRouter.post('/resume/pdf/:interviewReportId', authUser, generateResumePdfController);

export default interviewRouter;