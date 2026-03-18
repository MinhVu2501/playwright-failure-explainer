function createShowLastSummaryHandler({ vscode, output, summaryStore }) {
  return async function showLastSummary() {
    if (!summaryStore.has()) {
      vscode.window.showErrorMessage('No previous Playwright summary available.');
      return;
    }

    output.clear();
    output.show(true);
    output.appendLine('=== Last Stored Summary ===');
    output.appendLine(summaryStore.get());
  };
}

module.exports = {
  createShowLastSummaryHandler,
};

