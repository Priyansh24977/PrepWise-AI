import express from 'express';
import authUser from '../middlewares/auth.middlewares.js';
import { generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportsController, generateResumePdfController }  from '../controllers/interview.controller.js';
import upload from '../middlewares/file.middleware.js';



const interviewRouter=express.Router();

/** 
 *@route POST api/interview/
 *@description generate new interview report on the basis of user self description,
 resume pdf and job description
 *@access private
 */

 interviewRouter.post('/',authUser,upload.single("resume"),generateInterviewReportController);


 interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authUser, getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController)

export default interviewRouter;