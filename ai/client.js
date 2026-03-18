function buildAiPrompt(summaryText) {
  return [
    'Explain this Playwright summary in plain language for a developer.',
    'Do not suggest fixes.',
    'Do not generate code.',
    'Do not speculate beyond the evidence provided.',
    'Keep it concise and concrete.',
    'If the summary is incomplete, say that clearly.',
    '',
    'Summary:',
    summaryText,
  ].join('\n');
}

const openai = require('./providers/openai');
const anthropic = require('./providers/anthropic');
const openrouter = require('./providers/openrouter');
const groq = require('./providers/groq');

function getProviderAdapter(provider) {
  if (provider === 'anthropic') return anthropic;
  if (provider === 'openrouter') return openrouter;
  if (provider === 'groq') return groq;
  return openai;
}

function getProviderSecretKey(provider) {
  if (provider === 'anthropic') return 'playwrightFailureExplainer.apiKey.anthropic';
  if (provider === 'openrouter') return 'playwrightFailureExplainer.apiKey.openrouter';
  if (provider === 'groq') return 'playwrightFailureExplainer.apiKey.groq';
  return 'playwrightFailureExplainer.apiKey.openai';
}

function defaultModelForProvider(provider) {
  // Provider model availability changes over time. If a default breaks:
  // - OpenAI: verify via OpenAI docs / models
  // - Anthropic: verify via Anthropic (Claude) docs / models
  // - OpenRouter: verify via OpenRouter models list/API
  // - Groq: verify via Groq supported models (models endpoint / docs)
  if (provider === 'anthropic') return 'claude-3-5-sonnet-latest';
  if (provider === 'openrouter') return 'openai/gpt-4.1-mini';
  if (provider === 'groq') return 'llama-3.3-70b-versatile';
  return 'gpt-4.1-mini';
}

async function resolveAiConfig({ vscode, context }) {
  const cfg = vscode.workspace.getConfiguration('playwrightFailureExplainer');

  const provider = String(cfg.get('aiProvider') ?? 'openai').trim() || 'openai';
  const baseUrlRaw = String(cfg.get('aiBaseUrl') ?? '').trim();

  // Model selection: explicit aiModel wins; otherwise provider-specific default.
  // Backward compatibility: for OpenAI only, fall back to legacy openaiModel.
  const aiModelExplicit = String(cfg.get('aiModel') ?? '').trim();
  const legacyOpenAIModel =
    provider === 'openai' ? String(cfg.get('openaiModel') ?? '').trim() : '';
  const model = aiModelExplicit || legacyOpenAIModel || defaultModelForProvider(provider);

  const secretKey = getProviderSecretKey(provider);
  let apiKey = String((await context.secrets.get(secretKey)) ?? '').trim();

  // Backward compatibility: OpenAI users may already have the old secret key stored.
  if (!apiKey && provider === 'openai') {
    apiKey = String(
      (await context.secrets.get('playwrightFailureExplainer.openaiApiKey')) ?? ''
    ).trim();
  }

  const adapter = getProviderAdapter(provider);
  const baseUrl = baseUrlRaw || adapter.defaultBaseUrl();

  return { provider, model, baseUrl, apiKey };
}

async function explainSummaryWithAi({ vscode, context, summaryText }) {
  const prompt = buildAiPrompt(summaryText);
  const { provider, model, baseUrl, apiKey } = await resolveAiConfig({ vscode, context });
  if (!apiKey) {
    throw new Error(
      'Set your AI API key first using "Playwright Failure Explainer: Set AI API Key".'
    );
  }
  const adapter = getProviderAdapter(provider);

  const explanation = await adapter.explain({ apiKey, model, prompt, baseUrl });
  return explanation;
}

module.exports = {
  buildAiPrompt,
  resolveAiConfig,
  explainSummaryWithAi,
  getProviderSecretKey,
};

