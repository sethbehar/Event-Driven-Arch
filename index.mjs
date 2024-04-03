import https from 'node:https'; 
import { URL } from 'node:url';

export async function handler(event) {
    
  const payload = JSON.stringify({
    text: `Issue Created: ${event.issue.html_url}`,
  });

  const webhookUrl = process.env.SLACK_URL;
  const parsedUrl = new URL(webhookUrl);

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.pathname + parsedUrl.search, 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const sendSlackNotification = () => new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
      });

      res.on('end', () => {
        console.log('Success:', result);
        resolve(result);
      });
    });

    req.on('error', (err) => {
      console.error('Error:', err);
      reject(err);
    });

    req.write(payload);
    req.end();
  });

  try {
    const response = await sendSlackNotification();
    return response;
  } catch (error) {
    throw new Error('Fail');
  }
}