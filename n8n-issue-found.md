# Important: n8n Webhook Issue Found

Our tests have revealed that the n8n webhook is not properly registered. Here's what we discovered:

## The Exact Error

```
Status: 404
JSON response: {
  code: 404,
  message: 'The requested webhook "POST qa" is not registered.',
  hint: "The workflow must be active for a production URL to run successfully. You can activate the workflow using the toggle in the top-right of the editor."
}
```

## What This Means

1. The webhook endpoint "/qa" is not registered in n8n, or
2. The workflow containing this webhook is not active

## How to Fix This

1. Log into your n8n instance
2. Find the workflow that should contain the "/qa" webhook
3. Make sure the webhook path is correctly set to "qa" (not "question" or something else)
4. Ensure the workflow is activated by using the toggle in the top-right of the editor
5. If the workflow is already active, try deactivating and then reactivating it

## Testing After Fix

Once you've fixed these issues, you can test it with:

```
curl -X POST -H "Content-Type: application/json" -d '{"message":"What are IT policies in Chandigarh?"}' https://mohikagnext.app.n8n.cloud/webhook/qa
```

If you get a non-empty response, update `useChatSession.ts` to set `useMockResponse = false` to use the real webhook. 