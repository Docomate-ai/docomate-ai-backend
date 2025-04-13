export function otpMailTemplate(name: string, otp: number) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #4A90E2;">Welcome to DocomateAI, ${name}!</h2>
      <p>We're glad you're here. To continue, please use the one-time password (OTP) below to verify your email address:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #4A90E2;">
        ${otp}
      </div>
      <p>This OTP is valid for a limited time. Please do not share it with anyone.</p>
      <p>If you did not sign up for DocomateAI or believe this message was sent to you by mistake, we sincerely apologize. Please feel free to ignore this email.</p>
      <p>Thank you,<br>The DocomateAI Team</p>
    </div>
  `;
}
