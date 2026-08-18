// Elenco esplicito delle pagine riservate: a differenza delle rotte pubbliche,
// qui non possiamo permetterci un "tutto ciò che non è elencato altrove è
// protetto" perché un indirizzo scritto male o un link rotto finirebbe
// rimandato al login invece che a un vero 404. Quando si aggiunge una pagina
// sotto app/(app) (o un'altra pagina riservata fuori da quel gruppo) va
// aggiunta anche qui.
//
// Vive in un modulo a sé perché serve a due chiamanti diversi: il middleware,
// che decide chi rimandare al login, e robots.txt, che decide cosa i motori di
// ricerca non devono scansionare. Tenerne due copie significava vederle
// divergere — è già successo.
export const PROTECTED_EXACT = [
  "/dashboard",
  "/budget",
  "/cestino",
  "/compare",
  "/contacts",
  "/goals",
  "/impostazioni",
  "/newsletter",
  "/recurring",
  "/statistics",
  "/yearly",
  "/imposta-password",
  "/completa-profilo",
  "/api/export",
];

export const PROTECTED_PREFIXES = ["/contacts/", "/receipt/"];

export function isProtectedPath(path: string) {
  if (PROTECTED_EXACT.includes(path)) return true;
  return PROTECTED_PREFIXES.some((p) => path.startsWith(p));
}

// Rotte tecniche che non sono pagine da indicizzare a prescindere dall'accesso:
// le API (comprese quelle pubbliche di cron e disiscrizione) e il callback di
// autenticazione. Non stanno fra le protette perché il middleware le lascia
// passare, ma un motore di ricerca non deve comunque scansionarle.
const CRAWLER_DISALLOW_EXTRA = ["/api", "/auth"];

// Cosa mettere sotto Disallow in robots.txt: tutte le pagine riservate più le
// rotte tecniche qui sopra. Le voci già coperte da un prefisso più ampio
// (/api/export sta sotto /api) vengono tolte, così la regola non compare due
// volte dicendo la stessa cosa.
export function crawlerDisallowList(): string[] {
  const all = [
    ...CRAWLER_DISALLOW_EXTRA,
    ...PROTECTED_EXACT,
    ...PROTECTED_PREFIXES.map((p) => p.replace(/\/$/, "")),
  ];

  const withoutRedundant = all.filter(
    (path, i) =>
      !all.some((other, j) => j !== i && other !== path && path.startsWith(`${other}/`))
  );

  return Array.from(new Set(withoutRedundant)).sort();
}
