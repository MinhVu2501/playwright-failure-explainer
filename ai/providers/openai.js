const { httpsJsonRequest } = require('../http');

function defaultBaseUrl() {
  return 'https://api.openai.com';
}

async function explain({ apiKey, model, prompt, baseUrl }) {
  const body = JSON.stringify({
    model,
    input: prompt,
  });

  const { json } = await httpsJsonRequest({
    method: 'POST',
    url: `${baseUrl || defaultBaseUrl()}/v1/responses`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    body,
  });

  const text =
    (typeof json.output_text === 'string' && json.output_text.trim()) ||
    (Array.isArray(json.output) &&
      json.output
        .flatMap((item) => item?.content ?? [])
        .map((c) => c?.text)
        .filter((t) => typeof t === 'string' && t.trim().length > 0)
        .join('\n')
        .trim()) ||
    '';

  if (!text) throw new Error('OpenAI response did not include text output.');
  return text;
}

module.exports = {
  defaultBaseUrl,
  explain,
};

