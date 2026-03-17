const BASE =
  import.meta.env.DEV
    ? '/apex'
    : 'https://rodzaki.github.io/apex';

export const api = {
  threads: () =>
    fetch(`${BASE}/canon/thread-catalog.json`).then(r => r.json()),

  cards: () =>
    fetch(`${BASE}/canon/card-index.json`).then(r => r.json()),

  drawer: (name: string) =>
    fetch(`${BASE}/catalog/drawers/${name}.json`).then(r => r.json()),
};