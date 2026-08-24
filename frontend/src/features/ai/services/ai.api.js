import { api } from '../../auth/services/auth.api';

export async function generateInterviewReportApi({ file, jobDescription, selfDescription }) {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    if (selfDescription) {
        formData.append('selfDescription', selfDescription);
    }

    try {
        const response = await api.post('/api/interview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to generate interview report" };
    }
}

export async function getReportByIdApi(id) {
    try {
        const response = await api.get(`/api/interview/${id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to fetch report" };
    }
}

export async function downloadReportPdfApi(reportId) {
    try {
        const response = await api.get(`/api/interview/${reportId}/pdf`, {
            responseType: 'blob'
        });

        // Trigger browser download
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `PrepWise_Interview_Report_${reportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("PDF download error:", err);
        alert("Failed to download PDF report. Please try again.");
    }
}
