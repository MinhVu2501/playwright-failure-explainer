# Playwright Failure Explainer

Playwright Failure Explainer helps you rerun the current Playwright test file, capture a concise test summary, and get a plain-language AI explanation directly inside VS Code.

It is built for developers who want a faster way to understand Playwright failures without digging through raw terminal output every time.

## Features

- Run the current Playwright test file from VS Code
- Stream Playwright output into a dedicated output channel
- Generate a structured summary for the latest run
- Show the last stored summary
- Explain the last summary with AI in plain language
- Support multiple AI providers:
  - OpenAI
  - Anthropic
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
- A valid API key for the AI provider you want to use

## Quick Start

1. Open a Playwright test file such as `*.spec.js`, `*.spec.ts`, `*.test.js`, or `*.test.ts`
2. In VS Code Settings, choose your AI provider with `playwrightFailureExplainer.aiProvider`
3. Run `Playwright Failure Explainer: Set AI API Key`
4. Run `Playwright Failure Explainer: Run Current Test File`
5. Run `Playwright Failure Explainer: Show Last Summary` to review the stored result
6. Run `Playwright Failure Explainer: Explain Last Summary` to get an AI explanation

## How it works

1. The extension runs the active Playwright test file using `npx playwright test <file>`
2. Output is streamed into the Playwright Failure Explainer output channel
3. After the run finishes, the extension stores a concise structured summary of the latest result
4. You can reopen that summary with `Show Last Summary`
5. You can send that summary to your selected AI provider with `Explain Last Summary`

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

### `playwrightFailureExplainer.aiProvider`

Selects which AI provider is used for explanations.

Supported values:

- `openai`
- `anthropic`
- `openrouter`
- `groq`

### `playwrightFailureExplainer.aiModel`

Optional model override for the selected provider.

Leave this empty to use the extension default for that provider.

### `playwrightFailureExplainer.aiBaseUrl`

Optional base URL override for the selected provider.

### `playwrightFailureExplainer.openaiModel`

Legacy OpenAI setting kept for backward compatibility.

## AI Provider and API Key Notes

- The selected provider controls which API is called
- API keys are stored securely in VS Code Secret Storage
- API keys are stored per provider
- Changing the provider does not automatically reuse a key from another provider
- If you switch from `groq` to `openai`, you must run `Set AI API Key` again for `openai`
- `anthropic` is the provider setting used for Claude models

## Example setup

### OpenAI

- `playwrightFailureExplainer.aiProvider`: `openai`
- `playwrightFailureExplainer.aiModel`: leave empty or set a valid OpenAI model
- Run `Playwright Failure Explainer: Set AI API Key` and paste your OpenAI key

### Anthropic

- `playwrightFailureExplainer.aiProvider`: `anthropic`
- `playwrightFailureExplainer.aiModel`: leave empty or set a valid Anthropic model
- Run `Playwright Failure Explainer: Set AI API Key` and paste your Anthropic key

### OpenRouter

- `playwrightFailureExplainer.aiProvider`: `openrouter`
- `playwrightFailureExplainer.aiModel`: set an exact OpenRouter model id if needed
- Run `Playwright Failure Explainer: Set AI API Key` and paste your OpenRouter key

### Groq

- `playwrightFailureExplainer.aiProvider`: `groq`
- `playwrightFailureExplainer.aiModel`: leave empty or set a valid Groq model id
- Run `Playwright Failure Explainer: Set AI API Key` and paste your Groq key

## Choosing a valid AI model name

Model availability can change over time across providers. If AI explanation fails with a `model not found`, `unsupported model`, or `decommissioned` style error, set `playwrightFailureExplainer.aiModel` explicitly in VS Code settings.

- **OpenAI**: use a valid OpenAI model name
- **Anthropic**: use a valid Anthropic model name
- **OpenRouter**: use the exact model id listed by OpenRouter
- **Groq**: use a valid Groq model id

## Example workflow

### Passing test

1. Open a Playwright test file
2. Run `Playwright Failure Explainer: Run Current Test File`
3. The extension stores a summary of the latest run
4. Run `Show Last Summary` to review it
5. Run `Explain Last Summary` if you want an AI explanation of the result

### Failing test

1. Open a failing Playwright test file
2. Run `Playwright Failure Explainer: Run Current Test File`
3. The extension stores a structured summary of the failure
4. Run `Show Last Summary` to inspect the summary
5. Run `Explain Last Summary` to get a plain-language breakdown of what likely went wrong

## Known Limitations

- `Run Current Test File` runs the active Playwright test file, not a single test at the cursor
- The extension stores only the latest summary
- The last summary is stored for the current extension session
- If the extension host reloads, the stored summary is cleared
- Model availability depends on the selected provider and can change over time

## Known Issues

- If the provider, API key, model, or base URL is incorrect, AI explanation will fail
- Provider errors are shown in the output channel
- Some providers may deprecate model names over time, which may require updating `playwrightFailureExplainer.aiModel`

## Release Notes

### 0.0.2

- Verified local VSIX install flow
- Verified command activation in VS Code
- Verified current Playwright test file execution on a real project
- Verified summary save and show flow
- Verified AI explanation flow with provider-based API key storage

### 0.0.1

- Initial MVP release
- Run current Playwright test file from VS Code
- Generate structured test summaries
- Show last stored summary
- Explain summaries with AI
- Support OpenAI, Anthropic, OpenRouter, and Groq