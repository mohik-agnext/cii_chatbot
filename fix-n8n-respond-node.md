# Fixing the n8n "Respond to Webhook" Node

Based on our testing, your webhook is receiving requests correctly but returning empty responses. This guide will help you fix your "Respond to Webhook" node to return proper responses.

## What's Happening

Your webhook at `https://mohikagnext.app.n8n.cloud/webhook/policy` is:
- ✅ Receiving the requests (Status Code 200)
- ❌ Not returning any data (Content-Length: 0)

## How to Fix the "Respond to Webhook" Node

1. **Open your workflow in n8n** and find the "Respond to Webhook" node.

2. **Check the node configuration:**
   - Open the "Respond to Webhook" node by clicking on it
   - It should be set to "Respond With" = "Text" or "JSON"
   - Make sure it has content in the "Response Body" field

3. **Set the response body:**
   - If the "Response Type" is "JSON", the response body should look something like:
     ```
     {
       "text": "{{$node[\"AI Agent\"].json.output}}"
     }
     ```
   - Replace `$node[\"AI Agent\"].json.output` with the actual field that contains your AI's response
   - You can determine the correct field by:
     - Running a test execution of your workflow
     - Looking at the output of the AI Agent node
     - Finding the field that contains the text response

4. **Test the node:**
   - After making changes, click the "Test" button to run the node
   - Check if it returns a proper response

## Example Configuration

Here's how it should look:

1. **Respond With:** JSON
2. **Response Body:**
   ```
   {
     "text": "{{$node[\"AI Agent\"].json.text}}",
     "source": "n8n webhook"
   }
   ```

## Testing the Fix

After fixing the "Respond to Webhook" node:

1. Use the `webhook-test-page.html` tool we created to send a test message
2. It should show a proper response from n8n
3. Your chat application will then use the real responses instead of mock ones

## Common Issues

1. **Wrong variable reference:** Make sure you're using the correct variable name from the AI Agent output
2. **Missing connection:** Ensure there's a connection line from the AI Agent to the Respond to Webhook node
3. **Syntax error:** Check for proper JSON syntax in the response body
4. **Empty AI responses:** Make sure your AI Agent is generating responses 