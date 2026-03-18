function createPlaywrightFailureExplainerOutputChannel(vscode) {
  return vscode.window.createOutputChannel('Playwright Failure Explainer');
}

module.exports = {
  createPlaywrightFailureExplainerOutputChannel,
};

