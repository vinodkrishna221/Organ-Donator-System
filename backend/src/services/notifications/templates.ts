/**
 * Email Templates for Organ Donation Platform
 */

export interface MatchNotificationData {
    recipientName: string;
    organType: string;
    matchScore: number;
    donorBloodType: string;
    hospitalName: string;
    dashboardUrl: string;
}

export interface DonorRegistrationData {
    donorName: string;
    donationType: string;
    organs: string[];
    hospitalName: string;
    registrationDate: string;
}

export interface MatchDecisionData {
    organType: string;
    decision: 'accepted' | 'rejected';
    hospitalName: string;
    nextSteps?: string;
}

/**
 * Base template wrapper
 */
function wrapTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Organ Donation Platform</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a73e8; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; padding: 12px 24px; background: #1a73e8; color: white; text-decoration: none; border-radius: 4px; }
    .alert { padding: 15px; margin: 15px 0; border-radius: 4px; }
    .alert-success { background: #d4edda; color: #155724; }
    .alert-info { background: #cce5ff; color: #004085; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 Organ Donation Platform</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>NOTTO - National Organ and Tissue Transplant Organization</p>
      <p>Helpline: 1800-103-7100 | Website: https://notto.gov.in</p>
      <p><em>This is an automated notification. Please do not reply to this email.</em></p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Match found notification
 */
export function matchFoundTemplate(data: MatchNotificationData): string {
    return wrapTemplate(`
    <h2>🎉 Potential Match Found!</h2>
    <div class="alert alert-success">
      <p>A potential organ match has been identified for <strong>${data.recipientName}</strong>.</p>
    </div>
    <h3>Match Details:</h3>
    <ul>
      <li><strong>Organ:</strong> ${data.organType}</li>
      <li><strong>Match Score:</strong> ${data.matchScore}/100</li>
      <li><strong>Donor Blood Type:</strong> ${data.donorBloodType}</li>
      <li><strong>Hospital:</strong> ${data.hospitalName}</li>
    </ul>
    <p>Please review this match in your dashboard:</p>
    <p style="text-align: center;">
      <a href="${data.dashboardUrl}" class="button">View Match Details</a>
    </p>
    <p><strong>Important:</strong> Time is critical for organ transplants. Please review and respond as soon as possible.</p>
  `);
}

/**
 * Match accepted/rejected notification
 */
export function matchDecisionTemplate(data: MatchDecisionData): string {
    const isAccepted = data.decision === 'accepted';

    return wrapTemplate(`
    <h2>${isAccepted ? '✅ Match Accepted' : '❌ Match Declined'}</h2>
    <div class="alert ${isAccepted ? 'alert-success' : 'alert-info'}">
      <p>The ${data.organType} match has been <strong>${data.decision}</strong> by ${data.hospitalName}.</p>
    </div>
    ${isAccepted ? `
      <h3>Next Steps:</h3>
      <ol>
        <li>Coordinate with the transplant team</li>
        <li>Prepare the recipient for surgery</li>
        <li>Arrange organ transport logistics</li>
      </ol>
    ` : `
      <p>${data.nextSteps || 'The system will continue searching for suitable matches.'}</p>
    `}
    <p>For any questions, please contact your ROTTO/SOTTO coordinator.</p>
  `);
}

/**
 * New donor registered notification
 */
export function donorRegisteredTemplate(data: DonorRegistrationData): string {
    return wrapTemplate(`
    <h2>📋 New Donor Registered</h2>
    <div class="alert alert-info">
      <p>A new ${data.donationType.toLowerCase()} donor has been registered.</p>
    </div>
    <h3>Donor Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${data.donorName}</li>
      <li><strong>Donation Type:</strong> ${data.donationType}</li>
      <li><strong>Organs Available:</strong> ${data.organs.join(', ')}</li>
      <li><strong>Consulting Hospital:</strong> ${data.hospitalName}</li>
      <li><strong>Registration Date:</strong> ${data.registrationDate}</li>
    </ul>
    <p>The matching engine will now search for compatible recipients.</p>
  `);
}
