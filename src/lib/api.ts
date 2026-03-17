const BASE = import.meta.env.DEV
  ? '/apex'
  : 'https://rodzaki.github.io/apex'

export const api = {
  threads: () =>
    fetch(`${BASE}/canon/thread-catalog.json`).then(r => {
      if (!r.ok) throw new Error('Failed to load thread catalog')
      return r.json()
    }),

  cards: () =>
    fetch(`${BASE}/canon/card-index.json`).then(r => {
      if (!r.ok) throw new Error('Failed to load card index')
      return r.json()
    }),

  drawer: (name: string) =>
    fetch(`${BASE}/catalog/drawers/${name}.json`).then(r => {
      if (!r.ok) throw new Error(`Failed to load drawer ${name}`)
      return r.json()
    })
}