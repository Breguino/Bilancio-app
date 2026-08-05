// Elenco unico delle guide: lo usano sia la pagina indice /guide che la sitemap,
// così aggiungerne una nuova non richiede di ricordarsi di aggiornare due posti.
// Sta qui e non dentro app/guide/page.tsx perché Next.js non ammette export
// arbitrari da un file page.tsx.
export const guides = [
  {
    href: "/guide/conti-personali-e-lavoro",
    title: "Separare conti personali e di lavoro da freelance",
    body: "Perché mescolare le due contabilità rende impossibile capire quanto guadagni davvero, e tre modi per separarle — incluso quello che non richiede un secondo conto.",
  },
  {
    href: "/guide/mettere-da-parte-per-le-tasse",
    title: "Mettere da parte per le tasse senza impazzire",
    body: "Come trasformare l'accantonamento in un'abitudine automatica invece di una sorpresa annuale. Nessuna aliquota: solo il metodo.",
  },
  {
    href: "/guide/excel-o-app-per-il-budget",
    title: "Excel o un'app per il budget? Quando conviene passare",
    body: "Il foglio di calcolo funziona benissimo finché non smette di funzionare. Quattro segnali per accorgersene, e quando invece Excel resta la scelta giusta.",
  },
];
