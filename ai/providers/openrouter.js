const { httpsJsonRequest } = require('../http');

function defaultBaseUrl() {
  return 'https://openrouter.ai/api';
}

async function explain({ apiKey, model, prompt, baseUrl }) {
  const body = JSON.stringify({
    model,
    messages: [{ role: 'user', content: prompt }],
  });

  const { json } = await httpsJsonRequest({
    method: 'POST',
    url: `${baseUrl || defaultBaseUrl()}/v1/chat/completions`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    body,
  });

  const text = json?.choices?.[0]?.message?.content;
  if (typeof text === 'string' && text.trim()) return text.trim();
  throw new Error('OpenRouter response did not include message content.');
}

module.exports = {
  defaultBaseUrl,
  explain,
};

