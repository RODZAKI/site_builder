const CORPUS_BASE = "https://rodzaki.github.io";

export const api = {
  threads: () =>
    fetch(`${CORPUS_BASE}/canon/thread-catalog.json`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: Failed to load thread catalog`);
      return r.json();
    }),

  cards: () =>
    fetch(`${CORPUS_BASE}/canon/card-index.json`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: Failed to load card index`);
      return r.json();
    }),

  drawer: (name: string) =>
    fetch(`${CORPUS_BASE}/catalog/drawers/${name}.json`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: Failed to load drawer ${name}`);
      return r.json();
    }),
};