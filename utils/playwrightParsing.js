function classifyPlaywrightFailure(fullOutput) {
  const text = String(fullOutput ?? '');
  const lines = text.split(/\r?\n/);

  const rules = [
    {
      type: 'Missing file',
      meaning: 'The test depends on a file or path that does not exist in the current project context.',
      patterns: [/ENOENT/i, /no such file or directory/i],
    },
    {
      type: 'No tests found',
      meaning: 'Playwright ran, but it did not find any test cases matching the selected file or filters.',
      patterns: [/No tests found/i],
    },
    {
      type: 'Timeout',
      meaning: 'The test or one of its steps took too long and exceeded the allowed time limit.',
      patterns: [/Test timeout/i, /Timed out/i, /\btimeout\b/i],
    },
    {
      type: 'Assertion failed',
      meaning: 'A test expectation did not match the actual result.',
      patterns: [/AssertionError/i, /expect\(/i, /^Expected:/i, /^Received:/i],
    },
    {
      type: 'Locator / element issue',
      meaning: 'Playwright could not reliably find or interact with a page element required by the test.',
      patterns: [
        /locator\(/i,
        /strict mode violation/i,
        /element is not attached/i,
        /element is not visible/i,
        /waiting for selector/i,
      ],
    },
  ];

  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      const evidenceLine =
        lines.find((l) => pattern.test(l)) ??
        lines.find((l) => pattern.test(l.trim()));

      if (evidenceLine !== undefined) {
        return {
          type: rule.type,
          meaning: rule.meaning,
          evidence: evidenceLine.trim(),
        };
      }
    }
  }

  const fallbackEvidence = lines.find((l) => l.trim().length > 0)?.trim() ?? '';
  return {
    type: 'Unknown failure',
    meaning:
      'Playwright reported a failure, but it did not match one of the known summary categories yet.',
    evidence: fallbackEvidence,
  };
}

function extractFailingTestName(fullOutput) {
  const text = String(fullOutput ?? '');
  const lines = text.split(/\r?\n/);

  // Common Playwright pattern:
  // 1) some-file.spec.ts:25:1 › test name here
  const numberedFailureLine = lines.find((l) => /^\s*\d+\)\s+.+›\s+.+/.test(l));
  if (numberedFailureLine) {
    const match = numberedFailureLine.match(/^\s*\d+\)\s+.+?\s+›\s+(.+)\s*$/);
    if (match?.[1]) return match[1].trim();
  }

  return '(not identified)';
}

function extractFailureLocation(fullOutput) {
  const text = String(fullOutput ?? '');
  const lines = text.split(/\r?\n/);

  // Prefer the location shown in the numbered failure header line.
  const numberedFailureLine = lines.find((l) => /^\s*\d+\)\s+.+›\s+.+/.test(l));
  if (numberedFailureLine) {
    const match = numberedFailureLine.match(/^\s*\d+\)\s+(.+?)\s+›\s+.+\s*$/);
    if (match?.[1]) return match[1].trim();
  }

  // Fallback: search for a file:line:col token.
  const tokenMatch = text.match(/\b[\w./-]+\.(?:spec|test)\.(?:js|ts):\d+:\d+\b/);
  if (tokenMatch?.[0]) return tokenMatch[0].trim();

  return '(not identified)';
}

module.exports = {
  classifyPlaywrightFailure,
  extractFailingTestName,
  extractFailureLocation,
};

