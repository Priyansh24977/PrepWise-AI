import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { generateInterviewReportApi, downloadReportPdfApi } from '../services/ai.api';
import './dashboard.scss';

const HomeDashboard = () => {
    const { user, handleLogout } = useAuth();

    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMsg("Please upload your PDF resume.");
            return;
        }
        if (!jobDescription) {
            setErrorMsg("Please enter the Target Job Description.");
            return;
        }

        setIsGenerating(true);
        setErrorMsg('');

        try {
            const data = await generateInterviewReportApi({
                file,
                jobDescription,
                selfDescription
            });
            setReport(data.interviewReport);
        } catch (err) {
            setErrorMsg(err.message || "Failed to generate report. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPdf = () => {
        if (report && report._id) {
            downloadReportPdfApi(report._id);
        }
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="brand">
                    <h2>PrepWise AI</h2>
                </div>
                <div className="user-profile">
                    <span>Welcome, <strong>{user?.username || user?.email}</strong>!</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            <main className="dashboard-body">
                {/* Left Side: Form */}
                <div className="dashboard-card form-section">
                    <h3>Generate AI Interview Report</h3>
                    <p className="card-desc">Upload your resume and target role to get tailored questions, skill gap analysis, and a custom roadmap.</p>

                    {errorMsg && <div className="error-banner">{errorMsg}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Resume (PDF File)</label>
                            <input 
                                type="file" 
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Target Job Description</label>
                            <textarea 
                                rows="5"
                                placeholder="Paste the job description (responsibilities, required skills, qualifications)..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Self Description / Notes (Optional)</label>
                            <textarea 
                                rows="3"
                                placeholder="Briefly describe your career background, target level, or specific focus areas..."
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="generate-btn"
                            disabled={isGenerating}
                        >
                            {isGenerating ? "⚡ Generating Report via Gemini AI..." : "🚀 Generate Interview Report"}
                        </button>
                    </form>
                </div>

                {/* Right Side: Report Results */}
                <div className="dashboard-card report-section">
                    {!report ? (
                        <div className="empty-state">
                            <div className="empty-icon">📄</div>
                            <h4>Your AI Interview Report will appear here</h4>
                            <p>Fill out the details on the left and click Generate to see your personalized match score, interview questions, and prep roadmap.</p>
                        </div>
                    ) : (
                        <div className="report-content">
                            <div className="report-header">
                                <div>
                                    <h3>{report.title || "Interview Preparation Report"}</h3>
                                    <span className="match-badge">Match Score: {report.matchScore}%</span>
                                </div>
                                <button onClick={handleDownloadPdf} className="download-pdf-btn">
                                    📥 Download PDF Report
                                </button>
                            </div>

                            {/* Skill Gaps */}
                            {report.skillGaps && report.skillGaps.length > 0 && (
                                <div className="report-block">
                                    <h4>🎯 Skill Gap Analysis</h4>
                                    <div className="skill-tags">
                                        {report.skillGaps.map((sg, idx) => (
                                            <span key={idx} className={`skill-tag severity-${sg.severity}`}>
                                                {sg.skill} ({sg.severity?.toUpperCase()})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Technical Questions */}
                            {report.technicalQuestions && report.technicalQuestions.length > 0 && (
                                <div className="report-block">
                                    <h4>💻 Technical Questions & Guidelines</h4>
                                    {report.technicalQuestions.map((q, idx) => (
                                        <div key={idx} className="question-card">
                                            <p className="q-title"><strong>Q{idx+1}:</strong> {q.question}</p>
                                            <p className="q-intent">💡 <em>Interviewer Intent:</em> {q.intention}</p>
                                            <p className="q-answer">📝 <em>Recommended Answer:</em> {q.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Behavioral Questions */}
                            {report.behavioralQuestions && report.behavioralQuestions.length > 0 && (
                                <div className="report-block">
                                    <h4>🤝 Behavioral Questions</h4>
                                    {report.behavioralQuestions.map((q, idx) => (
                                        <div key={idx} className="question-card">
                                            <p className="q-title"><strong>Q{idx+1}:</strong> {q.question}</p>
                                            <p className="q-intent">💡 <em>Interviewer Intent:</em> {q.intention}</p>
                                            <p className="q-answer">📝 <em>Recommended Answer:</em> {q.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Preparation Roadmap */}
                            {report.preparationPlan && report.preparationPlan.length > 0 && (
                                <div className="report-block">
                                    <h4>📅 Day-wise Preparation Plan</h4>
                                    <div className="plan-roadmap">
                                        {report.preparationPlan.map((plan, idx) => (
                                            <div key={idx} className="plan-day">
                                                <h5>Day {plan.day}: {plan.focus}</h5>
                                                <ul>
                                                    {plan.tasks?.map((t, tidx) => (
                                                        <li key={tidx}>{t}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HomeDashboard;
