const { explainSummaryWithAi } = require('../ai/client');

function createExplainLastSummaryHandler({ vscode, context, output, summaryStore }) {
  return async function explainLastSummary() {
    if (!summaryStore.has()) {
      vscode.window.showErrorMessage('No previous Playwright summary available.');
      return;
    }

    output.show(true);
    output.appendLine('');
    output.appendLine('=== AI Explanation ===');

    try {
      const explanation = await explainSummaryWithAi({
        vscode,
        context,
        summaryText: summaryStore.get(),
      });
      output.appendLine(explanation);
    } catch (err) {
      const provider = String(
        vscode.workspace.getConfiguration('playwrightFailureExplainer').get('aiProvider') ??
          'openai'
      ).trim();
      const message = err?.message ?? String(err);
      output.appendLine('[AI error]');
      output.appendLine(`Provider: ${provider}`);
      output.appendLine(message);
      vscode.window.showErrorMessage(
        'Failed to explain the last summary with AI. Check your selected provider, API key, and model.'
      );
    }
  };
}

module.exports = {
  createExplainLastSummaryHandler,
};

