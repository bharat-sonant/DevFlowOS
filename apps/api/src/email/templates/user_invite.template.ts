export const userInviteTemplate = (
  inviteLink: string,
  companyName: string,
) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Invitation to Join ${companyName}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9fafb;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .header {
        background: #2563eb;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .content {
        padding: 30px;
      }
      .content h2 {
        font-size: 20px;
        margin-bottom: 15px;
        color: #111827;
      }
      .content p {
        font-size: 15px;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .button {
        display: inline-block;
        padding: 12px 20px;
        background: #2563eb;
        color: white !important;
        text-decoration: none;
        border-radius: 6px;
        font-size: 15px;
        font-weight: bold;
      }
      .footer {
        margin-top: 25px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Invitation to Join ${companyName}</h1>
      </div>
      <div class="content">
        <h2>Hello,</h2>
        <p>You’ve been invited to join <strong>${companyName}</strong>.</p>
        <p>Click the button below to accept the invitation and complete your registration:</p>
        <p style="text-align: center;">
          <a href="${inviteLink}" class="button">Accept Invitation</a>
        </p>
        <p>This link will expire in <strong>24 hours</strong>. If you weren’t expecting this invitation, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
