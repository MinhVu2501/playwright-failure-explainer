# Playwright Failure Explainer

Playwright Failure Explainer helps you rerun the current Playwright test file, capture a concise failure summary, and get a plain-language AI explanation directly inside VS Code.

It is designed for developers who want a faster way to understand why a Playwright test failed without digging through raw output every time.

## Features

- Run the current Playwright test file from VS Code
- Stream Playwright output into a dedicated output channel
- Generate a structured failure summary with:
  - test name
  - location
  - failure type
  - plain-language meaning
  - supporting evidence
- Show the last stored summary
- Explain the last summary with AI
- Support multiple AI providers:
  - OpenAI
  - Anthropic (Claude)
  - OpenRouter
  - Groq

## Commands

This extension adds the following commands:

- `Playwright Failure Explainer: Run Current Test File`
- `Playwright Failure Explainer: Show Last Summary`
- `Playwright Failure Explainer: Explain Last Summary`
- `Playwright Failure Explainer: Set AI API Key`

## Requirements

- A project that uses Playwright
- `npx playwright test` must work in your project environment
- A valid API key for the AI provider you want to use for explanations

## How it works

1. Open a Playwright test file such as `*.spec.js`, `*.spec.ts`, `*.test.js`, or `*.test.ts`
2. Run `Playwright Failure Explainer: Run Current Test File`
3. If the test fails, the extension stores a structured summary
4. Run `Playwright Failure Explainer: Show Last Summary` to review it
5. Run `Playwright Failure Explainer: Explain Last Summary` to get a plain-language AI explanation

## Supported test file types

The extension currently supports these file name patterns:

- `.spec.js`
- `.spec.ts`
- `.test.js`
- `.test.ts`
- `.spec.mjs`
- `.test.mjs`
- `.spec.cjs`
- `.test.cjs`

## Extension Settings

This extension contributes the following settings:

- `playwrightFailureExplainer.aiProvider`  
  Selects the AI provider used for explanation. Supported values:
  - `openai`
  - `anthropic` for Claude models
  - `openrouter`
  - `groq`

- `playwrightFailureExplainer.aiModel`  
  Optional model override for the selected provider. Leave this empty to use the extension’s default model for that provider.

- `playwrightFailureExplainer.aiBaseUrl`  
  Optional base URL override for the selected provider.

- `playwrightFailureExplainer.openaiModel`  
  Legacy OpenAI setting kept for backward compatibility.

## AI Provider Notes

- The selected provider controls which API is called.
- Your API key is stored securely in VS Code Secret Storage.
- API keys are stored per provider.
- If you switch providers, set a key for that provider too.
- `anthropic` is the provider setting to use for Claude models.

## Choosing a valid AI model name

Model availability can change over time across providers. If AI explanation fails with a `model not found` or `decommissioned` style error, set `playwrightFailureExplainer.aiModel` explicitly in VS Code settings.

- **OpenAI**: Use an OpenAI-supported model name
- **Anthropic (Claude)**: Use a Claude model name supported by Anthropic
- **OpenRouter**: Use the exact model id shown by OpenRouter
- **Groq**: Use a Groq-supported model id

## Example setup

### OpenAI
- `playwrightFailureExplainer.aiProvider`: `openai`
- `playwrightFailureExplainer.aiModel`: leave empty or set a valid OpenAI model

### Anthropic / Claude
- `playwrightFailureExplainer.aiProvider`: `anthropic`
- `playwrightFailureExplainer.aiModel`: leave empty or set a valid Claude model

### OpenRouter
- `playwrightFailureExplainer.aiProvider`: `openrouter`
- `playwrightFailureExplainer.aiModel`: set an exact OpenRouter model id if needed

### Groq
- `playwrightFailureExplainer.aiProvider`: `groq`
- `playwrightFailureExplainer.aiModel`: leave empty or set a valid Groq model id

## Known Limitations

- `Run Current Test File` runs the active Playwright test file, not a single test at cursor
- The last summary is stored in memory for the current extension session
- If you reload the Extension Development Host, the last stored summary is cleared
- Model availability depends on the selected provider and may change over time

## Known Issues

- If a provider key, model, or base URL is incorrect, AI explanation will fail and the output channel will show the provider error details
- Some providers may deprecate model names over time, which can require updating `playwrightFailureExplainer.aiModel`

## Release Notes

### 0.0.1

- Initial MVP release
- Run current Playwright test file from VS Code
- Generate structured failure summaries
- Show last stored summary
- Explain summaries with AI
- Support for OpenAI, Anthropic, OpenRouter, and Groq