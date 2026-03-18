const vscode = require('vscode');

const { createPlaywrightFailureExplainerOutputChannel } = require('./services/outputChannel');
const { createSummaryStore } = require('./services/summaryStore');

const { createRunCurrentTestHandler } = require('./commands/runCurrentTest');
const { createShowLastSummaryHandler } = require('./commands/showLastSummary');
const { createExplainLastSummaryHandler } = require('./commands/explainLastSummary');
const { createSetAiApiKeyHandler } = require('./commands/setAiApiKey');

function activate(context) {
  const output = createPlaywrightFailureExplainerOutputChannel(vscode);
  const summaryStore = createSummaryStore();

  const runCurrentTestDisposable = vscode.commands.registerCommand(
    'playwrightFailureExplainer.runCurrentTest',
    createRunCurrentTestHandler({ vscode, output, summaryStore })
  );

  const showLastSummaryDisposable = vscode.commands.registerCommand(
    'playwrightFailureExplainer.showLastSummary',
    createShowLastSummaryHandler({ vscode, output, summaryStore })
  );

  const explainLastSummaryDisposable = vscode.commands.registerCommand(
    'playwrightFailureExplainer.explainLastSummary',
    createExplainLastSummaryHandler({ vscode, context, output, summaryStore })
  );

  const setAiApiKeyDisposable = vscode.commands.registerCommand(
    'playwrightFailureExplainer.setAiApiKey',
    createSetAiApiKeyHandler({ vscode, context })
  );

  context.subscriptions.push(
    output,
    runCurrentTestDisposable,
    showLastSummaryDisposable,
    explainLastSummaryDisposable,
    setAiApiKeyDisposable
  );
}

function deactivate() {}

module.exports = { activate, deactivate };

