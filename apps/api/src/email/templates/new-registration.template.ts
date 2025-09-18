export const newRegistrationTemplate = (
  companyCode: string,
  empCode: string,
  // password: string,
  userCompanyName: string
): string => {
  const companyName = `${process.env.COMPANY_NAME}`;
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding:20px; text-align:center; background:#00695c; border-top-left-radius:8px; border-top-right-radius:8px;">
          <h2 style="color:#fff; margin:0;">Welcome to ${companyName}</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:30px; text-align:left; color:#333;">
          <p style="font-size:16px;">Your account has been created successfully. Below are your login credentials:</p>
          <ul style="list-style:none; padding:0; font-size:15px; color:#444;">
            <li><strong>Company Code:</strong> ${companyCode}</li>
            <li><strong>Employee Code:</strong> ${empCode}</li>
          </ul>
          <p style="margin-top:20px; font-size:15px;">You can login using the link below:</p>
          <a href="${process.env.FRONTEND_URL}" style="display:inline-block; margin-top:10px; padding:12px 24px; background:#00695c; color:#fff; text-decoration:none; border-radius:4px; font-weight:bold;">Login Now</a>
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
