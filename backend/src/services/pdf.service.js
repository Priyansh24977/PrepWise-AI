import PDFDocument from 'pdfkit';

export function generateReportPdf(report, res) {
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="PrepWise_Interview_Report_${report._id || 'download'}.pdf"`);

    doc.pipe(res);

    // Header Title
    doc.fillColor('#4f46e5').fontSize(22).text('PrepWise AI - Interview Preparation Report', { align: 'center' });
    doc.moveDown(0.3);
    doc.fillColor('#64748b').fontSize(10).text(`Generated on: ${new Date(report.createdAt || Date.now()).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1.5);

    // Match Score
    const score = report.matchScore !== undefined ? report.matchScore : 'N/A';
    doc.fillColor('#1e293b').fontSize(16).text(`Match Score: ${score}%`, { underline: true });
    doc.moveDown(0.8);

    if (report.title) {
        doc.fillColor('#334155').fontSize(13).text(`Role Title: ${report.title}`);
        doc.moveDown(1);
    }

    // Technical Questions
    if (report.technicalQuestions && report.technicalQuestions.length > 0) {
        doc.fillColor('#4f46e5').fontSize(15).text('Technical Questions');
        doc.moveDown(0.5);
        report.technicalQuestions.forEach((q, idx) => {
            doc.fillColor('#0f172a').fontSize(11).text(`${idx + 1}. ${q.question}`);
            doc.fillColor('#64748b').fontSize(9).text(`   Intention: ${q.intention}`);
            doc.fillColor('#334155').fontSize(9).text(`   Answer Guide: ${q.answer}`);
            doc.moveDown(0.6);
        });
        doc.moveDown(1);
    }

    // Behavioral Questions
    if (report.behavioralQuestions && report.behavioralQuestions.length > 0) {
        doc.fillColor('#4f46e5').fontSize(15).text('Behavioral Questions');
        doc.moveDown(0.5);
        report.behavioralQuestions.forEach((q, idx) => {
            doc.fillColor('#0f172a').fontSize(11).text(`${idx + 1}. ${q.question}`);
            doc.fillColor('#64748b').fontSize(9).text(`   Intention: ${q.intention}`);
            doc.fillColor('#334155').fontSize(9).text(`   Answer Guide: ${q.answer}`);
            doc.moveDown(0.6);
        });
        doc.moveDown(1);
    }

    // Skill Gaps
    if (report.skillGaps && report.skillGaps.length > 0) {
        doc.fillColor('#4f46e5').fontSize(15).text('Skill Gap Analysis');
        doc.moveDown(0.5);
        report.skillGaps.forEach((sg) => {
            doc.fillColor('#0f172a').fontSize(10).text(`• ${sg.skill} (Severity: ${(sg.severity || '').toUpperCase()})`);
        });
        doc.moveDown(1);
    }

    // Preparation Plan
    if (report.preparationPlan && report.preparationPlan.length > 0) {
        doc.fillColor('#4f46e5').fontSize(15).text('Day-wise Preparation Roadmap');
        doc.moveDown(0.5);
        report.preparationPlan.forEach((plan) => {
            doc.fillColor('#0f172a').fontSize(11).text(`Day ${plan.day}: ${plan.focus}`);
            if (plan.tasks && plan.tasks.length > 0) {
                plan.tasks.forEach((t) => {
                    doc.fillColor('#475569').fontSize(9).text(`  - ${t}`);
                });
            }
            doc.moveDown(0.5);
        });
    }

    doc.end();
}
