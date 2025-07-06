import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = twilio(accountSid, authToken);

export interface SMSMessage {
  to: string;
  body: string;
}


export async function sendSMS(to: string, body: string): Promise<boolean> {
  try {
    if (!accountSid || !authToken || !messagingServiceSid) {
      console.error('Twilio credentials not configured');
      return false;
    }

    const message = await client.messages.create({
      body,
      messagingServiceSid: messagingServiceSid,
      to: formatPhoneNumber(to),
    });

    console.log(`SMS sent successfully to ${to}: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

export async function sendBulkSMS(messages: SMSMessage[]): Promise<{
  success: string[];
  failed: string[];
}> {
  const results = {
    success: [] as string[],
    failed: [] as string[],
  };

  // Send messages in parallel with rate limiting
  const promises = messages.map(async (message) => {
    try {
      const success = await sendSMS(message.to, message.body);
      if (success) {
        results.success.push(message.to);
      } else {
        results.failed.push(message.to);
      }
    } catch (error) {
      console.error(`Failed to send SMS to ${message.to}:`, error);
      results.failed.push(message.to);
    }
  });

  await Promise.all(promises);
  return results;
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it's a 10-digit number, assume it's US and add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // If it's 11 digits and starts with 1, add +
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  // If it already has a +, return as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  // Otherwise, add + and return
  return `+${cleaned}`;
}

export function createIncidentAlertMessage(
  userName: string,
  location: string,
  timestamp: string
): string {
  return `
${userName} has reported an incident and needs your help.

Location: ${location}
Time: ${timestamp}

Check on them immediately and contact emergency if needed.

This is an automated alert from your safety app.`;
} 