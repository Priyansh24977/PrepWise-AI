import { PDFParse }  from 'pdf-parse';
import {generateInterviewReport, generateResumePdf} from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';

export async function generateInterviewReportController (req,res){
    try {
        console.log("req.file:", req.file);
        console.log("req.body:", req.body);

        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is missing"
            });
        }

        // Fix: pdf-parse is a plain async function, not a class
        const resumeContent = new PDFParse(req.file.buffer);

        const {selfDescription, jobDescription} = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        console.log("AI OUTPUT:");
        console.log(interviewReportByAi);

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (err) {
        console.error("GENERATE REPORT ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}


export async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (err) {
        console.error("GET REPORT BY ID ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
export async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (err) {
        console.error("GET ALL REPORTS ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
export async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error("GENERATE RESUME PDF ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}