import { PDFParse } from 'pdf-parse';
import { generateInterviewReport, generateResumePdf } from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';
import { generateReportPdf } from '../services/pdf.service.js';

export async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is missing"
            });
        }

        let resumeText = '';
        try {
            const parser = new PDFParse(Uint8Array.from(req.file.buffer));
            const extracted = await parser.getText();
            resumeText = typeof extracted === 'string' ? extracted : (extracted?.text || '');
            if (typeof parser.destroy === 'function') {
                await parser.destroy();
            }
        } catch (pdfErr) {
            console.error("PDF Parsing error fallback:", pdfErr.message);
            resumeText = req.file.buffer.toString('utf-8');
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required" });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || '',
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (err) {
        console.error("GENERATE REPORT ERROR:", err);
        return res.status(500).json({ success: false, message: err.message || "Failed to generate report" });
    }
}

export async function getInterviewReportByIdController(req, res) {
    try {
        const interviewId = req.params.interviewId || req.params.id;

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (err) {
        console.error("GET REPORT BY ID ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (err) {
        console.error("GET ALL REPORTS ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export async function downloadReportPdfController(req, res) {
    try {
        const id = req.params.id || req.params.interviewId || req.params.interviewReportId;
        const report = await interviewReportModel.findById(id);

        if (!report) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        generateReportPdf(report, res);
    } catch (error) {
        console.error("DOWNLOAD REPORT PDF ERROR:", error);
        return res.status(500).json({ message: "Failed to download PDF report" });
    }
}

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

        return res.send(pdfBuffer);
    } catch (err) {
        console.error("GENERATE RESUME PDF ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}