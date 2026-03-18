function createSummaryStore() {
  let lastSummaryText = '';

  return {
    get() {
      return lastSummaryText;
    },
    set(text) {
      lastSummaryText = String(text ?? '');
    },
    has() {
      return Boolean(lastSummaryText);
    },
  };
}

module.exports = {
  createSummaryStore,
};

