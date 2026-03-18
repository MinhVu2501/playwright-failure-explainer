function createSetAiApiKeyHandler({ vscode, context }) {
  return async function setAiApiKey() {
    const config = vscode.workspace.getConfiguration('playwrightFailureExplainer');
    const provider = String(config.get('aiProvider') ?? 'openai').trim() || 'openai';

    const value = await vscode.window.showInputBox({
      prompt: 'Enter your AI provider API key. It will be stored securely in VS Code.',
      placeHolder: `Current provider: ${provider}`,
      password: true,
      ignoreFocusOut: true,
    });

    const trimmed = String(value ?? '').trim();
    if (!trimmed) return;

    const secretKey =
      provider === 'anthropic'
        ? 'playwrightFailureExplainer.apiKey.anthropic'
        : provider === 'openrouter'
          ? 'playwrightFailureExplainer.apiKey.openrouter'
          : provider === 'groq'
            ? 'playwrightFailureExplainer.apiKey.groq'
          : 'playwrightFailureExplainer.apiKey.openai';

    await context.secrets.store(secretKey, trimmed);

    // Backward compatibility for existing OpenAI-only installs.
    if (provider === 'openai') {
      await context.secrets.store('playwrightFailureExplainer.openaiApiKey', trimmed);
    }

    vscode.window.showInformationMessage(`API key saved securely for ${provider}.`);
  };
}

module.exports = {
  createSetAiApiKeyHandler,
};

