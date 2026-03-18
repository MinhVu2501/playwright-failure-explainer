const { spawn } = require('child_process');
const path = require('path');
const {
  classifyPlaywrightFailure,
  extractFailingTestName,
  extractFailureLocation,
} = require('../utils/playwrightParsing');

function isSupportedTestFile(filePath) {
  return (
    filePath.endsWith('.spec.js') ||
    filePath.endsWith('.spec.ts') ||
    filePath.endsWith('.test.js') ||
    filePath.endsWith('.test.ts') ||
    filePath.endsWith('.spec.mjs') ||
    filePath.endsWith('.test.mjs') ||
    filePath.endsWith('.spec.cjs') ||
    filePath.endsWith('.test.cjs')
  );
}

function createRunCurrentTestHandler({ vscode, output, summaryStore }) {
  return async function runCurrentTest() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }

    const filePath = editor.document.uri.fsPath;
    if (!isSupportedTestFile(filePath)) {
      vscode.window.showErrorMessage('Active file is not a Playwright test file.');
      return;
    }

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
    const cwd = workspaceFolder ? workspaceFolder.uri.fsPath : path.dirname(filePath);

    output.clear();
    output.show(true);
    output.appendLine(`Running Playwright test for: ${filePath}`);
    output.appendLine(`cwd: ${cwd}`);
    output.appendLine(`Command: npx playwright test "${filePath}"`);
    output.appendLine('');

    const child = spawn('npx', ['playwright', 'test', filePath], {
      cwd,
      shell: false,
      env: process.env,
    });

    let combinedOutput = '';

    child.stdout?.on('data', (chunk) => {
      const text = chunk.toString();
      combinedOutput += text;
      output.append(text);
    });

    child.stderr?.on('data', (chunk) => {
      const text = chunk.toString();
      combinedOutput += text;
      output.append(text);
    });

    child.on('error', (err) => {
      const message = err?.message ?? String(err);

      const failureSummaryLines = [
        '=== Playwright Failure Summary ===',
        'Test: (not started)',
        'Location: (not identified)',
        'Type: Spawn error',
        'Meaning: The Playwright process could not be started from this environment.',
        `Evidence: ${message}`,
        'Exit Code: (not started)',
      ];

      summaryStore.set(failureSummaryLines.join('\n'));

      output.appendLine('');
      for (const line of failureSummaryLines) output.appendLine(line);
      vscode.window.showErrorMessage('Playwright test failed.');
    });

    child.on('close', (code) => {
      output.appendLine('');
      output.appendLine(`Process exited with code: ${code}`);

      if (code === 0) {
        summaryStore.set(
          [
            '=== Playwright Result Summary ===',
            `Test: ${filePath}`,
            'Result: Passed',
            'Exit Code: 0',
          ].join('\n')
        );
        vscode.window.showInformationMessage('Playwright test passed.');
        return;
      }

      const summary = classifyPlaywrightFailure(combinedOutput);
      const testName = extractFailingTestName(combinedOutput);
      const location = extractFailureLocation(combinedOutput);

      const failureSummaryLines = [
        '=== Playwright Failure Summary ===',
        `Test: ${testName}`,
        `Location: ${location}`,
        `Type: ${summary.type}`,
        `Meaning: ${summary.meaning}`,
        `Evidence: ${summary.evidence || '(no matching line found)'}`,
        `Exit Code: ${code}`,
      ];

      summaryStore.set(failureSummaryLines.join('\n'));

      output.appendLine('');
      for (const line of failureSummaryLines) output.appendLine(line);
      vscode.window.showErrorMessage('Playwright test failed.');
    });
  };
}

module.exports = {
  createRunCurrentTestHandler,
};

