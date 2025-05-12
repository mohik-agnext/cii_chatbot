# n8n Webhook Debugging Guide

This guide will help you debug and fix the webhook issue in your n8n workflow.

## Current Issue

The webhook at `https://mohikagnext.app.n8n.cloud/webhook/qa` is returning empty responses with `Content-Length: 0`, which means no data is being sent back to your application.

## How to Fix Your n8n Workflow

1. **Check the "Respond to Webhook" node:**
   - Make sure it's properly connected to the output of your AI Agent
   - Verify that the AI Agent is actually generating a response
   - Check the format of the response being sent back

2. **Create a Test Workflow to Verify Webhook Functionality:**
   - Create a new workflow with just two nodes:
     1. Webhook - Configure it with a new path (e.g., "test")
     2. Respond to Webhook - Connect it directly to the webhook
   - In the "Respond to Webhook" node, set a static response like:
   ```json
   {
     "message": "This is a test response from n8n"
   }
   ```
   - Save and activate this workflow
   - Test it using this curl command:
   ```
   curl -X POST https://mohikagnext.app.n8n.cloud/webhook/test -H "Content-Type: application/json" -d '{"message":"test"}'
   ```
   - You should receive the static response back

3. **Check Your AI Agent Configuration:**
   - Make sure your AI Agent is properly configured to respond to queries
   - Verify that the system message is appropriate
   - Check if Vector Store Tool is properly connected and returning results

4. **Inspect Data Flow in n8n:**
   - Use the "Debug" feature in n8n to see what data is flowing between nodes
   - Check if the AI Agent is generating a response at all
   - Verify the format of the data being passed to the "Respond to Webhook" node

## Common Issues and Solutions

1. **Empty Response from AI Agent:**
   - The AI agent might not be generating a response
   - Check your Vector Store to ensure it contains the data needed
   - Verify that your AI model credentials are correct

2. **Webhook Response Format:**
   - Ensure the "Respond to Webhook" node is configured to return JSON
   - The response should contain a proper text field that the frontend can use

3. **Connection Issues:**
   - Ensure all nodes are properly connected
   - Check that data is flowing from one node to the next

## Once You've Fixed the n8n Workflow

After you've fixed your n8n workflow and confirmed it's returning proper responses:

1. Update `useChatSession.ts` to set `useMockResponse = false`
2. Test the app to make sure it's now using the real webhook responses

## Need Help?

If you're having trouble fixing the n8n workflow, you can:

1. Share screenshots of your workflow configuration
2. Check the n8n execution logs for errors
3. Verify that your AI provider (e.g., Groq) is functioning correctly 