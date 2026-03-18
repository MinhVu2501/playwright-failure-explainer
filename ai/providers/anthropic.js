const { httpsJsonRequest } = require('../http');

function defaultBaseUrl() {
  return 'https://api.anthropic.com';
}

async function explain({ apiKey, model, prompt, baseUrl }) {
  const body = JSON.stringify({
    model,
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const { json } = await httpsJsonRequest({
    method: 'POST',
    url: `${baseUrl || defaultBaseUrl()}/v1/messages`,
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body),
    },
    body,
  });

  const text =
    (Array.isArray(json.content) &&
      json.content
        .map((c) => c?.text)
        .filter((t) => typeof t === 'string' && t.trim().length > 0)
        .join('\n')
        .trim()) ||
    '';

  if (!text) throw new Error('Anthropic response did not include text content.');
  return text;
}

module.exports = {
  defaultBaseUrl,
  explain,
};

