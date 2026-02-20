import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOTPVerificationEmail = async (email: string, otp: string) => {
    const mailOptions = {
        from: `"Physica Mastery" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Kode Verifikasi Physica Mastery',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 style="color: #8b5cf6; text-align: center;">Selamat Datang di Physica Mastery! 🚀</h2>
            <p>Halo,</p>
            <p>Terima kasih telah mendaftar. Untuk mengaktifkan akun dan mulai belajar, silakan masukkan kode verifikasi berikut:</p>
            
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                <h1 style="font-size: 32px; letter-spacing: 8px; margin: 0; color: #1e293b;">${otp}</h1>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">Kode ini hanya berlaku selama <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapapun.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">Tim Physica Mastery</p>
        </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};
