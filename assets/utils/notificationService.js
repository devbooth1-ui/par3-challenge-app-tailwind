// Notification service for immediate company alerts
// Current setup: devbooth1@yahoo.com with specialized addresses
// Future setup: par3challenge.com domain with email forwarding

// Company email configuration
const PRIMARY_EMAIL = "devbooth1@yahoo.com";
const AWARDS_EMAIL = "awards@par3challenge.com"; 
const REGISTRATION_EMAIL = "registration@par3challenge.com";
const VIDEO_EMAIL = "video@par3challenge.com";
const COMPANY_NAME = "Par 3 Challenge";

export const notifyCompany = async (prizeData) => {
    const {
        playerName,
        playerEmail,
        prizeType,
        prizeAmount,
        outfitDescription,
        teeDate,
        teeTime,
        timestamp,
        points
    } = prizeData;

    // Create formatted message for company notification
    const message = `
🚨 IMMEDIATE PRIZE CLAIM ALERT 🚨

Prize Type: ${prizeType}
Prize Value: ${prizeAmount}
Player: ${playerName}
Email: ${playerEmail}
Points Earned: ${points}

Verification Details:
- Outfit: ${outfitDescription}
- Date: ${teeDate}
- Time: ${teeTime}
- Submitted: ${timestamp}
`;

    // Send notification to company emails
    await Promise.all([
        sendEmail(PRIMARY_EMAIL, `Immediate Prize Claim Notification`, message),
        sendEmail(AWARDS_EMAIL, `Immediate Prize Claim Notification`, message),
        sendEmail(REGISTRATION_EMAIL, `Immediate Prize Claim Notification`, message),
        sendEmail(VIDEO_EMAIL, `Immediate Prize Claim Notification`, message)
    ]);
};

// Mock email sending function (to be replaced with real implementation)
const sendEmail = async (to, subject, body) => {
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
};

