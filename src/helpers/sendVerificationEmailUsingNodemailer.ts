// helpers/sendVerificationEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another email service
  auth: {
    user: 'rishabh3x@gmail.com',
    pass: 'lpfegilnuslelmot',
  },
});

export const sendVerificationEmail = async (email: any, username: any, verifyCode: string) => {
  const mailOptions = {
    from: 'rishabh3x@gmail.com',
    to: email,
    subject: 'Email Verification - Clothinix',
    html: `
      <h1>Email Verification</h1>
      <p>Hi ${username},</p>
      <p>Thank you for registering with Clothinix.</p>
      <p>Your verification code is: <strong>${verifyCode}</strong></p>
      <p>Please enter this code on the website to verify your email address.</p>
      <p>If you did not register, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Verification email sent successfully' };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Error sending verification email' };
  }
};
