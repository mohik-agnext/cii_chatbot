# n8n Webhook Response Guide

We've configured the app to use the webhook URL `https://mohikagnext.app.n8n.cloud/webhook/policy` as requested. However, our tests show that while the webhook is active and returns a 200 status code, it's still sending empty responses (Content-Length: 0).

## Current Issue

The webhook at `https://mohikagnext.app.n8n.cloud/webhook/policy` returns:
- Status: 200 (Success)
- Content-Type: application/json; charset=utf-8
- Content-Length: 0 (Empty response body)

This means the webhook endpoint is properly registered and active, but it's not returning any data.

## How to Fix Empty Responses in n8n

1. **Check the "Respond to Webhook" node:**
   - Make sure it's properly connected to your AI Agent output
   - Verify that the "Respond to Webhook" node has the proper response format set
   - Ensure data is flowing correctly from the AI Agent to the "Respond to Webhook" node

2. **Configure the "Respond to Webhook" node:**
   - In your n8n workflow, open the "Respond to Webhook" node
   - Make sure it's configured to return a response with content (not empty)
   - Set the response format to JSON and include the AI response in a field like "text" or "message"
   - Example configuration:
     ```
     {
       "text": "{{$json.aiResponse}}"
     }
     ```
   - Replace `$json.aiResponse` with the correct variable name that contains your AI's response

3. **Testing the Webhook:**
   - After making changes, test the webhook using:
     ```
     curl -X POST -H "Content-Type: application/json" -d '{"message":"What are IT policies in Chandigarh?"}' https://mohikagnext.app.n8n.cloud/webhook/policy
     ```
   - You should get a non-empty response with content

## Once the Webhook is Fixed

When you have confirmed that the webhook is returning proper non-empty responses:

1. Edit `src/hooks/useChatSession.ts` and set `useMockResponse = false`
2. Test the application to make sure it's using the real webhook responses

## Current App Configuration

For now, the app is set to use mock responses since the webhook is returning empty data. This ensures the app remains functional while you fix the n8n workflow. 