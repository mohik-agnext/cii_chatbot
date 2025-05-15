// Simple Node.js script to test n8n webhook with different payload formats
import fetch from 'node-fetch';

const WEBHOOK_URL = 'https://mohik.app.n8n.cloud/webhook/policy';
const TEST_MESSAGE = 'What are the IT policies in Chandigarh?';

// Different payload formats to try
const payloads = [
  {
    name: 'Simple message',
    body: JSON.stringify({ message: TEST_MESSAGE }),
    contentType: 'application/json'
  },
  {
    name: 'Text property',
    body: JSON.stringify({ text: TEST_MESSAGE }),
    contentType: 'application/json'
  },
  {
    name: 'Query property',
    body: JSON.stringify({ query: TEST_MESSAGE }),
    contentType: 'application/json'
  },
  {
    name: 'Data wrapper',
    body: JSON.stringify({ data: { message: TEST_MESSAGE } }),
    contentType: 'application/json'
  },
  {
    name: 'Plain text',
    body: TEST_MESSAGE,
    contentType: 'text/plain'
  }
];

async function testWebhook() {
  console.log(`Testing webhook: ${WEBHOOK_URL}\n`);
  
  for (const payload of payloads) {
    console.log(`\n--- Testing: ${payload.name} ---`);
    console.log(`Payload: ${payload.body}`);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': payload.contentType
        },
        body: payload.body
      });
      
      console.log(`Status: ${response.status}`);
      
      // Headers in node-fetch with ES modules work differently
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Headers:', headers);
      
      const contentType = response.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      
      const contentLength = response.headers.get('content-length');
      console.log(`Content-Length: ${contentLength}`);
      
      if (contentLength === '0') {
        console.log('Empty response received');
      } else {
        if (contentType && contentType.includes('application/json')) {
          const jsonResponse = await response.json();
          console.log('JSON response:', jsonResponse);
        } else {
          const textResponse = await response.text();
          console.log('Text response:', textResponse);
        }
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

testWebhook(); 