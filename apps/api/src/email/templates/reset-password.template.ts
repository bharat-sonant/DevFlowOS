export const resetPasswordTemplate = (token: string): string => {
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const companyName = `${process.env.COMPANY_NAME}`;
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding:20px; text-align:center; background:#b00020; border-top-left-radius:8px; border-top-right-radius:8px;">
          <h2 style="color:#fff; margin:0;">Password Reset</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:30px; text-align:center; color:#333;">
          <p style="font-size:16px;">You requested a password reset. Click the button below to create a new password:</p>
          <a href="${link}" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#b00020; color:#fff; text-decoration:none; border-radius:4px; font-weight:bold;">Reset Password</a>
          <p style="margin-top:20px; font-size:14px; color:#555;">If you didn’t request this, you can ignore this email.</p>
          <p style="margin-top:10px; font-size:13px; color:#777;">${link}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:15px; text-align:center; font-size:12px; color:#999; border-top:1px solid #eee;">
          © ${new Date().getFullYear()} ${companyName}. All rights reserved.
        </td>
      </tr>
    </table>
  </div>`;
};
