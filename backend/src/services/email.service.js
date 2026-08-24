import nodemailer from 'nodemailer';

let transporter = null;

function createTransporter(targetPort, isSecure) {
    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    if (!user || !pass) return null;

    return nodemailer.createTransport({
        host,
        port: Number(targetPort),
        secure: isSecure,
        auth: { user, pass },
        connectionTimeout: 10000,
    });
}

export async function sendOtpEmail(email, otp) {
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const initialPort = process.env.SMTP_PORT || process.env.EMAIL_PORT || 587;

    console.log(`\n==========================================`);
    console.log(`🔑 OTP GENERATED FOR [${email}]: ${otp}`);
    console.log(`==========================================\n`);

    if (!user || !pass) {
        console.log(`ℹ️ [Email Service] SMTP credentials not set in environment. OTP logged above.`);
        return { success: true, mode: 'console' };
    }

    const htmlContent = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #6366f1; margin: 0; font-size: 24px; font-weight: 700;">PrepWise AI</h2>
                <p style="color: #64748b; margin-top: 4px; font-size: 14px;">Your AI-Powered Interview Preparation Assistant</p>
            </div>
            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <p style="color: #334155; margin-bottom: 12px; font-size: 15px;">Use the following Verification Code (OTP) to complete your authentication:</p>
                <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #4f46e5; margin: 16px 0;">
                    ${otp}
                </div>
                <p style="color: #94a3b8; font-size: 13px; margin: 0;">This code is valid for 5 minutes. Do not share this code with anyone.</p>
            </div>
            <p style="color: #64748b; font-size: 13px; text-align: center; margin: 0;">
                If you did not request this code, please ignore this email.
            </p>
        </div>
    `;

    // Attempt 1: Try configured port
    try {
        const transporter = createTransporter(initialPort, Number(initialPort) === 465);
        await transporter.sendMail({
            from: `"PrepWise AI" <${user}>`,
            to: email,
            subject: `${otp} is your PrepWise AI verification code`,
            html: htmlContent
        });
        return { success: true, mode: 'smtp' };
    } catch (primaryErr) {
        console.warn(`⚠️ Primary SMTP send failed on port ${initialPort}: ${primaryErr.message}. Trying fallback port...`);
        // Attempt 2: Fallback to port 465 (SSL)
        const fallbackPort = Number(initialPort) === 465 ? 587 : 465;
        try {
            const fallbackTransporter = createTransporter(fallbackPort, fallbackPort === 465);
            await fallbackTransporter.sendMail({
                from: `"PrepWise AI" <${user}>`,
                to: email,
                subject: `${otp} is your PrepWise AI verification code`,
                html: htmlContent
            });
            return { success: true, mode: 'smtp-fallback' };
        } catch (fallbackErr) {
            console.error('❌ Failed to send OTP email via SMTP on fallback:', fallbackErr.message);
            return { success: true, mode: 'console-fallback', error: fallbackErr.message };
        }
    }
}
